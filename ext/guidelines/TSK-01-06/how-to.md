# How-To: Testing the CI Pipeline Locally

- **Task ID:** `TSK-01-06`
- **Domain:** Verification Workflows

---

## 1. Running the Full Local CI Suite

Execute the following compound command before opening a pull request:

```powershell
# 1. Rust Quality Gates
cargo fmt -- --check
cargo clippy --all-targets --all-features -- -D warnings
cargo nextest run --workspace
cargo audit
cargo deny check

# 2. Node & Design System Gates
pnpm run format:check
pnpm run build:packages
```

All commands must exit with code `0`.
