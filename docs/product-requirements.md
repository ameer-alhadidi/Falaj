# Product Requirements Document (PRD)
## Enterprise Visual Website Development Platform

- **Status:** Approved Draft (Phase 0A)
- **Author:** Lead Systems Architect
- **Target Audience:** Engineering, Product, Security, Architecture Review Board

---

## 1. Executive Summary & Vision

The Enterprise Visual Website Development Platform is a schema-driven, low-code/visual web creation and application-building platform inspired by Webflow and Wix, tailored specifically for high-security enterprise environments.

The platform enables two primary user personas:
1. **Developers:** Create, lay out, configure, and publish sophisticated web pages and business applications using a 12-column visual grid canvas, hierarchical sitemaps, approved REST API integrations, and declarative JSON data bindings.
2. **Platform Administrators:** Centrally govern available UI component registries, theme versions, allowed REST endpoints, identity providers, authorization policies, and resource quotas, ensuring strict compliance and zero unauthorized data egress.

### Core Architectural Axioms
- **Schema-Driven Rendering:** Pages are stored strictly as structured, validated JSON trees (`CanvasComponentNode`). There is zero execution of arbitrary user-supplied JavaScript in the browser or server runtime.
- **Defense-in-Depth Security:** The platform operates an upstream API broker enforcing custom DNS-resolved SSRF protection (`hickory-resolver`), 4-tier server authorization, and envelope encryption of credentials.
- **Bidirectional by Design:** English (LTR) and Arabic (RTL) are equal-class citizens, supported via CSS logical properties, paired typography, and mirrored grid coordinates.
- **Enterprise Multi-Tenancy & Governance:** Centralized restrictions ensure developers cannot exceed approved quotas, invoke unauthorized endpoints, or access projects outside their assigned permissions.

---

## 2. User Personas & Scenarios

### Persona 1: Platform Administrator (Sara)
- **Role:** Enterprise Architect / Security Lead.
- **Goals:** 
  - Register approved internal REST APIs (e.g., Core HR Employee Directory, ERP Orders).
  - Configure upstream authentication credentials (OAuth 2.0 Client Credentials) stored with envelope encryption.
  - Define role permission identifiers (e.g., `employees.read`, `payroll.read`, `orders.write`).
  - Restrict projects to approved theme versions, component sets, and adapter implementations.
  - Audit all broker transactions, publications, and developer access events.

### Persona 2: Application Developer (Tariq)
- **Role:** Full-Stack Developer / Business Application Builder.
- **Goals:**
  - Structure an application sitemap with nested routes, groups, and route-level access rules.
  - Drag and drop components (Grids, Cards, Tables, Forms) onto a responsive 12-column canvas.
  - Bind visual elements to approved REST APIs using RFC 9535 path expressions (`$` and `@`).
  - Configure responsive breakpoints (Desktop base, Tablet, Mobile) and test RTL layout live.
  - Test mutations with CSRF-protected forms, validate draft versions, and publish immutable releases.

### Persona 3: Authenticated Site Visitor (Ahmed)
- **Role:** Department Manager / Internal Employee.
- **Goals:**
  - Access published portals (e.g. `https://internal-portal.sites.example.com/managers`).
  - Authenticate against Keycloak / corporate OIDC provider.
  - View personalized and authorized employee records without receiving unauthorized payroll columns or unprivileged API responses.

---

## 3. High-Level Feature Requirements

### 3.1 Workspace & Project Governance
- **REQ-PRJ-01:** Project Creation Wizard capturing project code, display name, description, assigned members, allowed framework versions, approved component catalog, allowed API integrations, and quota thresholds.
- **REQ-PRJ-02:** Strict server-side enforcement of project membership; developers cannot query or modify unassigned projects via direct API manipulation.
- **REQ-PRJ-03:** Versioned governance configurations: Changes to allowed integrations or theme versions require authorized administrative migrations.

### 3.2 Visual Studio & 12-Column Canvas
- **REQ-EDT-01:** Hierarchical sitemap tree managing pages, nested pages, and virtual route groups.
- **REQ-EDT-02:** Responsive 12-column CSS Grid canvas supporting column start (1–12), span (1–12), row start/span, alignment, and auto/min-height sizing.
- **REQ-EDT-03:** Viewport simulator for Desktop (base), Tablet (768px), and Mobile (375px), with inheritance and responsive breakpoint overrides.
- **REQ-EDT-04:** Bidirectional layout: One-click toggle between LTR (English) and RTL (Arabic) with mirrored coordinates and Arabic companion fonts.
- **REQ-EDT-05:** Command-based undo/redo history preserving stable component IDs.
- **REQ-EDT-06:** Accessible drag-and-drop powered by `@dnd-kit` with keyboard sensor support (`Space`/`Enter` lift/drop, Arrow reorder).
- **REQ-EDT-07:** Dynamic property inspector auto-generated from registered component schemas with live canvas feedback.
- **REQ-EDT-08:** Optimistic locking concurrency with version incrementing, presence indicators, and conflict resolution (reload, compare, overwrite with permission).

### 3.3 API Integration & Data Binding Engine
- **REQ-API-01:** Centralized API Registry storing environment base URLs, OpenAPI 3.x operation imports, and JSON Schemas.
- **REQ-API-02:** Secure Upstream API Broker: All outbound requests pass through the Rust backend. Direct client-to-upstream connections are forbidden.
- **REQ-API-03:** Custom RFC 9535 binding path syntax:
  - Root collection paths: `$` (e.g. `$.data`, `$.total`).
  - Item-relative template paths: `@` (e.g. `@.id`, `@.department.name`).
- **REQ-API-04:** Binding Inspector allowing developers to select fields from a live sanitized JSON tree and map them to component slots.
- **REQ-API-05:** Mutating Write Bindings: Form submissions and button actions dispatching POST/PUT/PATCH/DELETE mutations with client & server schema validation and CSRF protection.

### 3.4 Security & Access Control
- **REQ-SEC-01:** Strict separation of Builder Identity (portal developers) and Site-Visitor Identity (end users).
- **REQ-SEC-02:** Four independent server-enforced authorization layers:
  1. Page Access Layer.
  2. Component Visibility Layer.
  3. API Operation Layer.
  4. Project Administration Layer.
- **REQ-SEC-03:** Custom DNS-resolved SSRF protection blocking private, loopback, link-local, and cloud metadata ranges with zero DNS rebinding gap.
- **REQ-SEC-04:** Envelope encryption for stored API credentials using AES-256-GCM data keys and master KMS keys.
- **REQ-SEC-05:** Write-only credential UI (values are never echoed back to client browsers).

### 3.5 Publication & Runtime Delivery
- **REQ-PUB-01:** Pre-publication integrity verification (sitemap validation, route collisions, binding schemas, permission audits).
- **REQ-PUB-02:** Immutable Release Manifest generation containing frozen page schemas, theme tokens, and adapter configurations.
- **REQ-PUB-03:** Manifest-driven site renderer delivering pages via SSR (protected routes) and Static Generation (public routes).
- **REQ-PUB-04:** Instant one-click rollback to prior release manifests with immutable audit logging.

---

## 4. Non-Functional Targets & Quality Metrics

| Metric | Target Specification | Enforcement Mechanism |
| :--- | :--- | :--- |
| **Canvas Performance** | 500 component nodes per page with <100ms interaction latency | Virtualized canvas trees, command batching |
| **Project Capacity** | 1,000 pages per project | Paginated sitemap trees, indexed database queries |
| **Platform Concurrency** | 200 concurrent active editors | Optimistic concurrency, stateless Axum nodes |
| **Broker Latency Overhead** | p95 < 50ms overhead (excluding upstream duration) | Async Tokio I/O, custom DNS connection pooling |
| **Published TTFB** | p95 < 300ms for cached public pages | Edge caching, streaming SSR |
| **Accessibility Standard** | 100% WCAG 2.2 AA compliant | Playwright + `@axe-core/playwright` CI gates |
| **Internationalization** | Full English (LTR) and Arabic (RTL) parity | CSS Logical Properties, paired typography |
| **Code Quality Bar** | 0 warnings (`clippy`, `eslint`, `tsc`), >80% test coverage | Strict CI gate with `cargo-deny` and `cargo-audit` |
