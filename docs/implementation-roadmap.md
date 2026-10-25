# Implementation Roadmap & Phase Execution Plan
## Enterprise Visual Website Development Platform

- **Status:** Approved Draft (Phase 0A)
- **Author:** Lead Systems Architect
- **Reference:** Section 12, Master Prompt

---

## 1. Phasing Strategy & Governance Principles

Every phase boundary constitutes a strict architectural checkpoint. In accordance with Section 1, no phase shall begin without explicit written sign-off. Each phase ends with a comprehensive acceptance report formatted via the `phase-report` skill, accompanied by automated test evidence and reproducible demonstrations.

---

## 2. Phase-by-Phase Execution Plan

```
  [ Phase −1: Tooling Setup ] ------------> COMPLETE & SIGNED OFF
              |
  [ Phase 0A: Design Specifications ] ----> CURRENT TURN (Docs Generation)
              |
  [ Phase 0B: Interactive Prototypes ] ---> 3 Next.js Prototypes in prototypes/
              |
  [ Phase 1: Platform Foundation ] -------> Monorepo, Axum API, Compose Stack, CI
              |
  [ Phase 2: Admin & Governance ] --------> Projects, Builder RBAC, Restrictions
              |
  [ Phase 3: Visual Editor & Canvas ] ----> 12-Col Grid, dnd-kit, Sitemap, RTL
              |
  [ Phase 4: API Broker & Bindings ] -----> SSRF Resolver, RFC 9535 Conformance
              |
  [ Phase 5: Publication & Site Runtime ] > Manifest Renderer, OIDC Visitor Auth
              |
  [ Phase 6: Hardening & Enterprise ] ----> Perf Targets, WCAG Audit, OpenShift
```

---

### Phase 0B: Interactive Prototypes
- **Scope:** Build three focused Next.js applications in `prototypes/` consuming `packages/design-system` and rendering sample data conforming to the Phase 0A `CanvasComponentNode` schema:
  1. `prototype-1-studio`: Visual toolbar, sitemap, 12-column canvas with guide overlays, property inspector, employee table rendering.
  2. `prototype-2-data-mapping`: Visual JSON tree explorer, connector lines, collection path (`$.data`) and field mapping (`@.department.name`), live repeated row preview.
  3. `prototype-3-admin`: Project wizard, adapter/theme restriction toggles, write-only credential vault UI, audit trail feed.
- **Verification Gates:**
  - Automated Playwright screenshots captured for desktop (1536×826) and tablet (768×1024) viewports in both Light and Dark modes.
  - At least one screen demonstrating complete Arabic (RTL) layout with companion Arabic typography.
  - Usability trade-off analysis and technical recommendations delivered.

### Phase 1: Platform Foundation & Infrastructure
- **Scope:**
  - Establish `pnpm` + `cargo` monorepo structure.
  - Scaffold Rust `services/platform-api` with Axum, Tokio, tracing JSON logging, and centralized error handling.
  - Initialize PostgreSQL migrations in `database/migrations/` using `sqlx-cli`.
  - Package `packages/design-system` with authoritative Enterprise Studio tokens.
  - Define rootless Podman `compose.yaml` and Containerfiles for local services.
- **Verification Gates:**
  - `podman compose up` brings up the local stack cleanly under rootless Podman.
  - CI pipeline passes on `cargo fmt`, `clippy -- -D warnings`, `cargo-audit`, `cargo-deny`, `eslint`, and `prettier`.

### Phase 2: Admin Governance & Builder Identity
- **Scope:**
  - Builder authentication via Keycloak OIDC (PKCE, HttpOnly server cookies).
  - Project CRUD APIs, quotas, and assigned developer memberships.
  - Theme version catalog and adapter restriction management.
- **Verification Gates:**
  - Admin creates a project and assigns a developer.
  - Integration test proves an unassigned developer receives `403 Forbidden` attempting to query or modify the project.

### Phase 3: Visual Studio Canvas & Optimistic Concurrency
- **Scope:**
  - Hierarchical sitemap tree with route conflict detection.
  - 12-column responsive grid canvas with `@dnd-kit` drag-and-drop and keyboard sensors.
  - Dynamic property inspector generating form fields from component schemas.
  - Versioned page saving with monotonic integers and optimistic concurrency conflict handling.
- **Verification Gates:**
  - End-to-end test steps 5–8 pass in CI.
  - Complete page assembly verified using keyboard-only navigation.
  - Stale-save conflict test proves the editor detects concurrent edits and offers compare/reload.

### Phase 4: Upstream API Broker & RFC 9535 Bindings
- **Scope:**
  - API Registry storing base URLs, OpenAPI 3.x imports, and JSON Schemas.
  - Upstream API Broker in Rust with custom DNS resolver (`hickory-resolver`), blocking private, loopback, CGNAT, link-local, and cloud metadata IPs.
  - Manual redirect hop inspector (max 3 hops) and `.no_proxy()` enforcement.
  - Parser and evaluator for the RFC 9535 binding grammar (`$`, `@`) implemented in both Rust and TypeScript.
- **Verification Gates:**
  - SSRF test suite passes (verifying private IPs, IPv6/IPv4-mapped forms, DNS rebinding simulation, redirects to metadata, and proxy environment variables).
  - Shared conformance test suite (`packages/page-schema/conformance/*.json`) passes 100% in both Rust and TypeScript test runners.

### Phase 5: Publication Engine & Site Runtime
- **Scope:**
  - Pre-publication integrity validator (sitemap routes, schema properties, API bindings).
  - Immutable release manifest generator with SHA-256 checksums and one-click rollback.
  - Manifest-driven site renderer (Next.js) serving static public routes and SSR protected routes.
  - Site-visitor identity integration with Keycloak and 4-tier authorization enforcement.
- **Verification Gates:**
  - End-to-end scenario steps 11–16 pass.
  - Automated security assertion proves an unauthorized visitor cannot retrieve protected employee data via SSR HTML, client hydration JSON (`__NEXT_DATA__`), API broker calls, or edge caches.

### Phase 6: Enterprise Hardening & Operational Readiness
- **Scope:**
  - Comprehensive security review using the `security-review` skill.
  - Full WCAG 2.2 AA accessibility audit using `@axe-core/playwright`.
  - Performance benchmarking against Section 9.4 targets (500 components <100ms, broker latency <50ms, TTFB <300ms).
  - Zero-downtime database backup and disaster recovery drill.
  - Production deployment documentation for Kubernetes and Red Hat OpenShift.
- **Verification Gates:**
  - All non-functional targets in Section 9.4 measured and certified.
  - Final phase acceptance report and executive release demonstration.
