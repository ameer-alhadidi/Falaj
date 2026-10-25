# Examples: Migration SQL & SQLx Repository

- **Task ID:** `TSK-01-03`
- **Domain:** Database Implementation

---

## 1. Initial Migration File (`database/migrations/0001_initial_schema.sql`)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(63) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(63) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_project_slug UNIQUE (tenant_id, slug)
);
```

---

## 2. SQLx Repository Implementation

```rust
use sqlx::PgPool;
use uuid::Uuid;

pub struct ProjectRepository {
    pool: PgPool,
}

impl ProjectRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_project_by_id(&self, id: Uuid) -> Result<Option<ProjectRecord>, sqlx::Error> {
        sqlx::query_as!(
            ProjectRecord,
            r#"SELECT id, tenant_id, name, slug, created_at FROM projects WHERE id = $1"#,
            id
        )
        .fetch_optional(&self.pool)
        .await
    }
}
```
