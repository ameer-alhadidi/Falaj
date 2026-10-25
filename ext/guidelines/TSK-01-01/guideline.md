# Guideline: Monorepo Scaffold & Workspace Setup

- **Task ID:** `TSK-01-01`
- **Phase:** Phase 1
- **Domain:** Workspace Infrastructure & Monorepo Architecture

---

## Architectural Principles & Invariants

1. **Dual Workspace Architecture:**
   - **Rust Cargo Workspace:** Top-level `Cargo.toml` manages all microservices (`services/*`) and backend crates (`crates/*`).
   - **pnpm Workspace:** Top-level `pnpm-workspace.yaml` manages all Next.js applications (`apps/*`) and shared packages (`packages/*`).

2. **Zero Circular Dependencies:**
   - Packages may depend only downwards: `apps` $\to$ `packages` $\to$ base utilities.
   - Internal dependencies must use workspace protocol (`workspace:*`).

3. **Strict TypeScript & Formatting Configs:**
   - Base tsconfig in `tsconfig.base.json` extended by all workspace packages.
   - Centralized Prettier and ESLint configurations.
