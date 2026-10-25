# Examples: GitHub Actions Workflow Definition

- **Task ID:** `TSK-01-06`
- **Domain:** CI Implementation

---

## 1. CI Workflow (`.github/workflows/ci.yml`)

```yaml
name: Continuous Integration

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  rust-gates:
    name: Rust Quality Gates
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with:
          components: rustfmt, clippy
      - uses: taiki-e/install-action@nextest
      - uses: taiki-e/install-action@cargo-audit
      - uses: taiki-e/install-action@cargo-deny

      - name: Rustfmt Check
        run: cargo fmt -- --check

      - name: Clippy Warnings Gate
        run: cargo clippy --all-targets --all-features -- -D warnings

      - name: Run Unit Tests
        run: cargo nextest run --workspace

      - name: Security Vulnerability Scan
        run: cargo audit

      - name: License & Advisory Audit
        run: cargo deny check

  node-gates:
    name: Node & TypeScript Gates
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 11
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: 'pnpm'

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Prettier Format Check
        run: pnpm run format:check

      - name: Build Packages
        run: pnpm run build:packages
```
