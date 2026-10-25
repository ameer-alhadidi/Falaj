# Test Cases: CLI Toolchain Verification

- **Task ID:** `TSK-P1-02`
- **Domain:** Toolchain Sanity Checks

---

## Toolchain Smoke Test Suite

```powershell
# TC-TOOL-01: Rust compiler version
rustc --version
# Expected: rustc 1.99.0 or newer

# TC-TOOL-02: Cargo package manager version
cargo --version
# Expected: cargo 1.99.0 or newer

# TC-TOOL-03: Nextest runner version
cargo nextest --version
# Expected: cargo-nextest 0.9.148 or newer

# TC-TOOL-04: SQLx CLI version
sqlx --version
# Expected: sqlx-cli 0.9.0

# TC-TOOL-05: Node.js & pnpm versions
node --version
pnpm --version
# Expected: Node v24.x, pnpm 11.x

# TC-TOOL-06: Security auditor versions
cargo audit --version
cargo deny --version
```
