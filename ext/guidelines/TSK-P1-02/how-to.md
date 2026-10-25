# How-To: Running the Full Quality Gate Audit

- **Task ID:** `TSK-P1-02`
- **Domain:** Developer Workflow

---

## 1. Local Pre-Commit Audit Sequence

Run the following commands in sequence before submitting any code:

```powershell
# 1. Code Formatting Check
cargo fmt -- --check
pnpm prettier --check "**/*.{ts,tsx,json,css,md}"

# 2. Strict Linting
cargo clippy --all-targets --all-features -- -D warnings
pnpm eslint . --max-warnings 0

# 3. Security Vulnerability Scan
cargo audit

# 4. Dependency License & Advisory Gate
cargo deny check advisories bans licenses sources

# 5. Fast Nextest Execution
cargo nextest run --all-features

# 6. End-to-End Browser Tests
pnpm dlx playwright test
```

---

## 2. Resolving Common Audit Errors

- **Unused imports or variables:** Remove or prefix with `_`.
- **Clippy unwrap warning:** Replace with explicit pattern matching (`match`, `if let`, or `?` error propagation).
- **Yanked dependency in `cargo audit`:** Update crate version in `Cargo.toml` via `cargo update -p <crate>`.
