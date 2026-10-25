# Project Kanban Board
## Enterprise Visual Website Development Platform

- **Location:** `ext/kanban.md`
- **Companion Guide:** [`ext/how-to-guide.md`](file:///d:/work/Falaj/ext/how-to-guide.md)
- **Last Updated:** 2026-10-25

---

## 1. Board Summary & Velocity

| Column | Description | Task Count |
| :--- | :--- | :--- |
| **✅ Done** | Verified, tested, signed-off tasks | 2 Phases (7 Tasks) |
| **🔍 In Review** | Awaiting user sign-off | Phase 0A Sign-off |
| **🔄 In Progress** | Active execution | 0 |
| **⏳ Ready** | Approved for immediate pickup upon phase sign-off | Phase 0B (4 Tasks) |
| **📋 Backlog** | Planned upcoming phases | Phases 1–6 (18 Tasks) |

---

## 2. Visual Kanban Board

### ✅ Done (Verified & Signed-Off)

| Task ID | Phase | Title | Completed Date | Deliverables & Artifacts | Linked Guidelines Directory (Guideline, Example, How-To, Tests) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TSK-P1-01` | Phase −1 | Rootless Podman & Socket Setup | 2026-10-25 | Podman 6.0.2 rootless, compose 1.6.0, socket `\\.\pipe\podman-machine-default` | [`ext/guidelines/TSK-P1-01/`](file:///d:/work/Falaj/ext/guidelines/TSK-P1-01/) |
| `TSK-P1-02` | Phase −1 | CLI Toolchain Installation | 2026-10-25 | `rustc`, `cargo`, `rustfmt`, `clippy`, `cargo-nextest`, `sqlx-cli`, `cargo-audit`, `cargo-deny`, Node 24, pnpm 11, Playwright 1.64.1 | [`ext/guidelines/TSK-P1-02/`](file:///d:/work/Falaj/ext/guidelines/TSK-P1-02/) |
| `TSK-P1-03` | Phase −1 | Context7 MCP Smoke Testing | 2026-10-25 | Resolved `/tokio-rs/axum` v0.8.4/v0.7.9, verified router state retrieval | [`ext/guidelines/TSK-P1-03/`](file:///d:/work/Falaj/ext/guidelines/TSK-P1-03/) |
| `TSK-P1-04` | Phase −1 | Project-Local Skills Creation | 2026-10-25 | 7 skills authored in `.claude/skills/` and mirrored to `.agents/skills/` | [`ext/guidelines/TSK-P1-04/`](file:///d:/work/Falaj/ext/guidelines/TSK-P1-04/) |
| `TSK-P1-05` | Phase −1 | Tooling & Decisions Documentation | 2026-10-25 | [`docs/tooling.md`](file:///d:/work/Falaj/docs/tooling.md), [`docs/outstanding-decisions.md`](file:///d:/work/Falaj/docs/outstanding-decisions.md) (DEC-001 to DEC-005) | [`ext/guidelines/TSK-P1-05/`](file:///d:/work/Falaj/ext/guidelines/TSK-P1-05/) |
| `TSK-0A-01` | Phase 0A | System Blueprints & Core Schemas | 2026-10-25 | [`docs/product-requirements.md`](file:///d:/work/Falaj/docs/product-requirements.md), [`docs/architecture.md`](file:///d:/work/Falaj/docs/architecture.md), [`docs/data-model.md`](file:///d:/work/Falaj/docs/data-model.md) | [`ext/guidelines/TSK-0A-01/`](file:///d:/work/Falaj/ext/guidelines/TSK-0A-01/) |
| `TSK-0A-02` | Phase 0A | Security, Path Grammar & Theme Audit | 2026-10-25 | [`docs/security-model.md`](file:///d:/work/Falaj/docs/security-model.md), [`docs/page-schema.md`](file:///d:/work/Falaj/docs/page-schema.md), [`docs/theme-system.md`](file:///d:/work/Falaj/docs/theme-system.md) (WCAG Audit), [`docs/adapter-contract.md`](file:///d:/work/Falaj/docs/adapter-contract.md) | [`ext/guidelines/TSK-0A-02/`](file:///d:/work/Falaj/ext/guidelines/TSK-0A-02/) |
| `TSK-0B-01` | Phase 0B | Prototype 1: Desktop Studio Canvas | 2026-10-25 | Next.js app on port 3001, 12-col grid canvas, sitemap, inspector, employee table | [`ext/guidelines/TSK-0B-01/`](file:///d:/work/Falaj/ext/guidelines/TSK-0B-01/) |
| `TSK-0B-02` | Phase 0B | Prototype 2: API & Data-Binding Matrix | 2026-10-25 | Next.js app on port 3002, JSON tree inspector, RFC 9535 syntax validator, live repeater preview | [`ext/guidelines/TSK-0B-02/`](file:///d:/work/Falaj/ext/guidelines/TSK-0B-02/) |
| `TSK-0B-03` | Phase 0B | Prototype 3: Admin & Security Gateway | 2026-10-25 | Next.js app on port 3003, project governance, write-only credentials vault, dual identity | [`ext/guidelines/TSK-0B-03/`](file:///d:/work/Falaj/ext/guidelines/TSK-0B-03/) |
| `TSK-0B-04` | Phase 0B | Multi-Theme & RTL Screenshot Harness | 2026-10-25 | Automated Playwright browser verification across viewports, themes, and Arabic RTL | [`ext/guidelines/TSK-0B-04/`](file:///d:/work/Falaj/ext/guidelines/TSK-0B-04/) |
| `REV-0B` | Phase 0B | Phase 0B Prototypes Acceptance | 2026-10-25 | 3 Runnable Next.js Apps, Captured Screenshots & Recordings, [`docs/prototypes-evaluation.md`](file:///d:/work/Falaj/docs/prototypes-evaluation.md) | Signed off by user |
| `TSK-01-01` | Phase 1 | Monorepo Scaffold & Workspace Setup | 2026-10-25 | Root Cargo workspace, pnpm workspace, shared TypeScript configs, clippy/deny/audit zero errors | [`ext/guidelines/TSK-01-01/`](file:///d:/work/Falaj/ext/guidelines/TSK-01-01/) |
| `TSK-01-02` | Phase 1 | Rust Platform API Service Skeleton | 2026-10-25 | `services/platform-api` with Axum, Tokio, tracing structured logging, graceful shutdown, nextest passing | [`ext/guidelines/TSK-01-02/`](file:///d:/work/Falaj/ext/guidelines/TSK-01-02/) |
| `TSK-01-03` | Phase 1 | PostgreSQL Migrations & Repository | 2026-10-25 | `database/migrations/` (4 migrations: tenants, users, pages, credentials/audit), `PageRepository` with optimistic locks | [`ext/guidelines/TSK-01-03/`](file:///d:/work/Falaj/ext/guidelines/TSK-01-03/) |
| `TSK-01-04` | Phase 1 | Design System Distribution | 2026-10-25 | Single-source tokens, build, and package linking via `@falaj/design-system` | [`ext/guidelines/TSK-01-04/`](file:///d:/work/Falaj/ext/guidelines/TSK-01-04/) |
| `TSK-01-05` | Phase 1 | Rootless Podman Compose Stack | 2026-10-25 | `compose.yaml` with PostgreSQL 18, Keycloak 26.7, multi-stage Containerfile, rootless port mappings | [`ext/guidelines/TSK-01-05/`](file:///d:/work/Falaj/ext/guidelines/TSK-01-05/) |
| `TSK-01-06` | Phase 1 | CI Pipeline on Podman | 2026-10-25 | `.github/workflows/ci.yml` running cargo clippy, nextest, audit, deny, and prettier checks | [`ext/guidelines/TSK-01-06/`](file:///d:/work/Falaj/ext/guidelines/TSK-01-06/) |
| `TSK-03-02` | Phase 3 | Complete 72 HeroUI v3 Components, Skills & Prompts, Canvas Reordering & Live Preview | 2026-10-25 | Phase 3 Studio with all 72 HeroUI components across 7 categories, canvas move/reorder, live preview mode, dynamic 72-component admin governance, mirrored HeroUI skills (react/migration/native) & system prompts | [`ext/guidelines/TSK-03-02/`](file:///d:/work/Falaj/ext/guidelines/TSK-03-02/) |

---

### 🔍 In Review (Awaiting Phase Sign-Off)

| Task ID | Phase | Title | Submitter | Review Items | Next Step |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `REV-01` | Phase 1 | Phase 1 Foundation Acceptance | Lead Systems Architect | Monorepo workspaces, Platform API with graceful shutdown, 4 SQL migrations, compose.yaml, CI workflow | Authorize Phase 2 pickup |

---

### 🔄 In Progress

*None (Awaiting Phase 1 Sign-off)*

---

### ⏳ Ready (Phase 2: Builder Identity & Governance)

| Task ID | Phase | Title | Priority | Scope Summary | Target Path | Guidelines Directory |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TSK-02-01` | Phase 2 | Builder Identity & Keycloak OIDC | High | Server-managed session cookies (HttpOnly, SameSite) and PKCE flow | `services/platform-api/src/auth/` | `ext/guidelines/TSK-02-01/` |
| `TSK-02-02` | Phase 2 | Project Restrictions & 4-Tier RBAC | High | Quota enforcement, tier-4 permissions, allowed adapters/themes | `services/platform-api/src/projects/` | `ext/guidelines/TSK-02-02/` |

---

### 📋 Backlog (Future Phases 1 to 6)

#### Phase 1: Platform Foundation & Infrastructure
- `TSK-01-01`: Monorepo Scaffold (`pnpm-workspace.yaml`, Cargo root workspace, TypeScript configurations).
- `TSK-01-02`: Rust Platform API Service Skeleton (`services/platform-api`, Axum, Tokio, tracing JSON logger).
- `TSK-01-03`: PostgreSQL Migrations & Repository Layer (`database/migrations/`, SQLx compile-time queries).
- `TSK-01-04`: `packages/design-system` Package (Enterprise Studio CSS custom properties, utility tokens).
- `TSK-01-05`: Rootless Podman Compose Stack (`compose.yaml`, Containerfiles for API, DB, Keycloak).
- `TSK-01-06`: CI Pipeline Setup (Git workflows running `cargo clippy`, `cargo-nextest`, `cargo-audit`, `cargo-deny`, `pnpm lint`).

#### Phase 2: Builder Identity & Governance
- `TSK-02-01`: Builder OIDC Authentication (Keycloak integration, PKCE, secure HttpOnly session cookies).
- `TSK-02-02`: Project CRUD & Quota Management API.
- `TSK-02-03`: 4-Tier Server Authorization Enforcement (Tier 4 Project Admin RBAC).

#### Phase 3: Visual Studio Canvas & Optimistic Locking
- `TSK-03-01`: Sitemap Hierarchy & Route Management with cycle/collision prevention.
- `TSK-03-02`: 12-Column Responsive Canvas with `@dnd-kit` drag-and-drop & keyboard sensor navigation.
- `TSK-03-03`: Dynamic Property Inspector generated from component schemas.
- `TSK-03-04`: Optimistic Concurrency Engine (monotonic version integers, conflict detection, reload/compare).

#### Phase 4: API Broker & Binding Engine
- `TSK-04-01`: API Registry & OpenAPI 3.x Import Engine.
- `TSK-04-02`: Hardened Upstream API Broker (SSRF protection via `hickory-resolver` custom DNS, manual redirect hop inspector).
- `TSK-04-03`: RFC 9535 Dual-Language Conformance Engine (Rust + TypeScript AST evaluators with conformance suite).
- `TSK-04-04`: Mutating Write Bindings with Anti-CSRF protection.

#### Phase 5: Publication & Site Runtime
- `TSK-05-01`: Pre-Publication Integrity Validator & Release Manifest Builder.
- `TSK-05-02`: Manifest-Driven Site Renderer (Hybrid: static generation for public, SSR for protected).
- `TSK-05-03`: Site-Visitor OIDC Identity & Component-Level Permission Data Stripping.
- `TSK-05-04`: One-Click Release Rollback & Audit Trail.

#### Phase 6: Enterprise Hardening & Operational Delivery
- `TSK-06-01`: End-to-End Security Review (`security-review` checklist).
- `TSK-06-02`: Automated WCAG 2.2 AA Audit (`@axe-core/playwright`).
- `TSK-06-03`: Performance Benchmarking against Section 9.4 SLAs.
- `TSK-06-04`: Database Disaster Recovery & Kubernetes/OpenShift Deployment Documentation.
