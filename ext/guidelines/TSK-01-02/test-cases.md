# Test Cases: Platform API Health & Error Mapping

- **Task ID:** `TSK-01-02`
- **Domain:** Backend Verification

---

## Axum Integration Test Cases

```rust
use axum::{body::Body, http::{Request, StatusCode}};
use tower::ServiceExt;

#[tokio::test]
async fn test_health_check_returns_200_ok() {
    let app = create_app().await;

    let response = app
        .oneshot(
            Request::builder()
                .uri("/health")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}
```
