use sqlx::{PgPool, Row};
use uuid::Uuid;

pub struct PageRepository {
    pool: PgPool,
}

impl PageRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    /// Fetches the highest version number for a page
    pub async fn get_current_version(&self, page_id: Uuid) -> Result<i64, sqlx::Error> {
        let row = sqlx::query(
            "SELECT COALESCE(MAX(version_number), 0) as current_version FROM page_versions WHERE page_id = $1",
        )
        .bind(page_id)
        .fetch_one(&self.pool)
        .await?;

        let version: i64 = row.try_get("current_version")?;
        Ok(version)
    }

    /// Saves a new immutable version of a page enforcing optimistic concurrency
    pub async fn save_page_version(
        &self,
        page_id: Uuid,
        expected_version: i64,
        ast_root: serde_json::Value,
        commit_message: Option<String>,
        created_by: Uuid,
    ) -> Result<i64, crate::PlatformError> {
        let mut tx = self.pool.begin().await.map_err(|e| {
            crate::PlatformError::Internal(format!("Failed to start transaction: {}", e))
        })?;

        // 1. Version check
        let current_version = self.get_current_version(page_id).await.map_err(|e| {
            crate::PlatformError::Internal(format!("Failed to query page version: {}", e))
        })?;

        if current_version != expected_version {
            return Err(crate::PlatformError::Conflict {
                current: current_version,
                expected: expected_version,
            });
        }

        let next_version = current_version + 1;

        // 2. Insert immutable version
        sqlx::query(
            r#"
            INSERT INTO page_versions (page_id, version_number, ast_root, commit_message, created_by)
            VALUES ($1, $2, $3, $4, $5)
            "#,
        )
        .bind(page_id)
        .bind(next_version)
        .bind(ast_root)
        .bind(commit_message)
        .bind(created_by)
        .execute(&mut *tx)
        .await
        .map_err(|e| crate::PlatformError::Internal(format!("Failed to insert version: {}", e)))?;

        // 3. Update current page pointer
        sqlx::query(
            "UPDATE pages SET current_version_number = $1, updated_at = NOW() WHERE id = $2",
        )
        .bind(next_version)
        .bind(page_id)
        .execute(&mut *tx)
        .await
        .map_err(|e| {
            crate::PlatformError::Internal(format!("Failed to update page pointer: {}", e))
        })?;

        tx.commit().await.map_err(|e| {
            crate::PlatformError::Internal(format!("Failed to commit transaction: {}", e))
        })?;

        Ok(next_version)
    }
}
