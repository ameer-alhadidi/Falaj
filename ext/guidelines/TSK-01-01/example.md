# Examples: Monorepo Root Configurations

- **Task ID:** `TSK-01-01`
- **Domain:** Monorepo Configuration

---

## 1. Top-Level `pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'prototypes/*'
```

---

## 2. Root `Cargo.toml` Workspace Definition

```toml
[workspace]
resolver = "2"
members = [
    "services/platform-api",
    "crates/page-schema",
    "crates/expr-eval",
    "crates/security-broker",
]

[workspace.package]
version = "0.1.0"
edition = "2021"
rust-version = "1.85"
license = "Proprietary"

[workspace.dependencies]
axum = "0.8"
tokio = { version = "1.43", features = ["full"] }
sqlx = { version = "0.8", default-features = false, features = ["postgres", "runtime-tokio-rustls", "uuid", "chrono", "json"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["json", "env-filter"] }
thiserror = "2.0"
uuid = { version = "1.13", features = ["v4", "serde"] }
```
