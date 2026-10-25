# Guideline: CLI Toolchain Installation & Quality Audits

- **Task ID:** `TSK-P1-02`
- **Phase:** Phase −1
- **Domain:** Tooling & Quality Gates

---

## Architectural Principles & Invariants

1. **Zero-Warning Tolerance:**
   - All Rust and TypeScript code must pass compiler checks, linters (`clippy`, `eslint`), and formatters (`rustfmt`, `prettier`) with zero warnings.
   - Any compiler or linter warning is treated as a build failure.

2. **Automated Security & License Scanning:**
   - Every crate dependency is verified against RustSec advisory databases via `cargo audit`.
   - Every dependency license is checked against enterprise license policy via `cargo deny` (prohibiting AGPL, copyleft, and unapproved licenses).

3. **Modern Fast Test Execution:**
   - Cargo tests run via `cargo-nextest` for parallel execution, detailed failure reporting, and flaky-test detection.
