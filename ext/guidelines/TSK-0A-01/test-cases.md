# Test Cases: Page Schema & Optimistic Locking

- **Task ID:** `TSK-0A-01`
- **Domain:** Data Validation & Concurrency Tests

---

## Schema & Concurrency Test Cases

```rust
#[tokio::test]
async fn test_optimistic_locking_prevents_stale_overwrite() {
    let pool = setup_test_pool().await;
    let page_id = create_test_page(&pool).await;

    // 1. First save succeeds at version 1
    let v1 = save_page(&pool, page_id, 0, json!({"id": "root"})).await.unwrap();
    assert_eq!(v1.new_version, 1);

    // 2. Concurrent user attempts to save expecting version 0
    let err = save_page(&pool, page_id, 0, json!({"id": "root-stale"})).await.unwrap_err();
    assert_eq!(err.status_code(), axum::http::StatusCode::CONFLICT);

    // 3. Proper save expecting version 1 succeeds at version 2
    let v2 = save_page(&pool, page_id, 1, json!({"id": "root-v2"})).await.unwrap();
    assert_eq!(v2.new_version, 2);
}
```
