# Examples: Axum Server Router & Centralized Error Handler

- **Task ID:** `TSK-01-02`
- **Domain:** Backend Implementation

---

## 1. Axum Main Application Setup

```rust
use axum::{routing::get, Router};
use std::net::SocketAddr;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info,platform_api=debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let app = Router::new()
        .route("/health", get(health_check));

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::info!("Platform API listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> &'static str {
    "{\"status\":\"healthy\",\"service\":\"platform-api\"}"
}
```
