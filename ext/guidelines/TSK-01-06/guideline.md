# Guideline: Continuous Integration Pipeline on Podman

- **Task ID:** `TSK-01-06`
- **Phase:** Phase 1
- **Domain:** CI/CD & Automated Verification

---

## Architectural Principles & Invariants

1. **Non-Negotiable Quality Gates:**
   Every pull request and trunk commit must execute:
   - `cargo fmt -- --check`
   - `pnpm format:check`
   - `cargo clippy --all-targets --all-features -- -D warnings`
   - `cargo nextest run --workspace`
   - `cargo audit`
   - `cargo deny check`

2. **Rootless Container Execution in CI:**
   - CI runners must use unprivileged container execution via Podman.
   - Prohibit root daemon requirements.

3. **Deterministic Dependency Resolution:**
   - Use frozen lockfiles: `pnpm install --frozen-lockfile` and `cargo check --locked`.
