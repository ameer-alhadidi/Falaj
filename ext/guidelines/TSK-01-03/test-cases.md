# Test Cases: Database Schema & Migration Idempotence

- **Task ID:** `TSK-01-03`
- **Domain:** Database Verification

---

## Migration Test Suite

```rust
#[tokio::test]
async fn test_migrations_apply_cleanly() {
    let pool = setup_test_database().await;

    // Run migrations
    sqlx::migrate!("./database/migrations")
        .run(&pool)
        .await
        .expect("Migrations must apply cleanly on fresh database");

    // Verify tenants table exists
    let count: (i64,) = sqlx::query_as("SELECT count(*) FROM tenants")
        .fetch_one(&pool)
        .await
        .unwrap();

    assert_eq!(count.0, 0);
}
```
