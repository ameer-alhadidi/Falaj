//! Platform API Service
//!
//! Central backend service providing tenant/project management, page schema
//! versioning, and secure API broker connectivity.

use axum::{
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::get,
    Json, Router,
};
use serde_json::json;
use std::net::SocketAddr;
use std::sync::Arc;
use thiserror::Error;
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

pub mod db;

#[derive(Error, Debug)]
pub enum PlatformError {
    #[error("Resource not found: {0}")]
    NotFound(String),
    #[error("Optimistic lock conflict: current={current}, expected={expected}")]
    Conflict { current: i64, expected: i64 },
    #[error("Authorization denied: missing permission '{0}'")]
    Forbidden(String),
    #[error("Internal service error: {0}")]
    Internal(String),
}

impl IntoResponse for PlatformError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            PlatformError::NotFound(msg) => (StatusCode::NOT_FOUND, msg),
            PlatformError::Conflict { current, expected } => (
                StatusCode::CONFLICT,
                format!(
                    "Version conflict: current={}, expected={}",
                    current, expected
                ),
            ),
            PlatformError::Forbidden(perm) => (
                StatusCode::FORBIDDEN,
                format!("Missing required permission: {}", perm),
            ),
            PlatformError::Internal(err) => {
                tracing::error!("Internal error: {}", err);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Internal server error".to_string(),
                )
            }
        };

        let body = Json(json!({
            "error": {
                "status": status.as_u16(),
                "message": message,
            }
        }));

        (status, body).into_response()
    }
}

pub struct AppState {
    pub service_name: &'static str,
    pub version: &'static str,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info,platform_api=debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let state = Arc::new(AppState {
        service_name: "platform-api",
        version: env!("CARGO_PKG_VERSION"),
    });

    let app = Router::new()
        .route("/health", get(health_handler))
        .route("/api/v1/status", get(status_handler))
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".into());
    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".into())
        .parse()
        .unwrap_or(8080);

    let addr: SocketAddr = format!("{}:{}", host, port).parse()?;
    tracing::info!("Platform API initialized and listening on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    Ok(())
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    tracing::info!("Graceful shutdown signal received, draining connections...");
}

async fn health_handler() -> &'static str {
    "OK"
}

async fn status_handler(State(state): State<Arc<AppState>>) -> Json<serde_json::Value> {
    Json(json!({
        "service": state.service_name,
        "version": state.version,
        "status": "operational",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::Request;
    use tower::ServiceExt;

    #[tokio::test]
    async fn test_health_check_endpoint() {
        let state = Arc::new(AppState {
            service_name: "platform-api",
            version: "0.1.0",
        });

        let app = Router::new()
            .route("/health", get(health_handler))
            .with_state(state);

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
}
