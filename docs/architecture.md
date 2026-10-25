# Architecture Specification
## Enterprise Visual Website Development Platform

- **Status:** Approved Draft (Phase 0A)
- **Author:** Lead Systems Architect
- **Target Audience:** Engineering, Infrastructure, Security

---

## 1. System Topology & Three Runtime Surfaces

The platform architecture is partitioned into three distinct runtime surfaces, enforcing separation of concerns, independent scaling, and zero privilege escalation.

```
                           +--------------------------------------------+
                           |           Enterprise Identity              |
                           |   (Keycloak / OIDC Platform IdP)          |
                           +---------------------+----------------------+
                                                 |
                   [ Builder Identity Session ]  |  [ Site Visitor Session ]
                                                 |
       +-------------------------------+         |         +-------------------------------+
       |       SURFACE 1: PORTAL       |         |         |   SURFACE 3: SITE RUNTIME     |
       |     Next.js App Router        |         |         |     Next.js App Router        |
       |  Theme: Enterprise Studio     |         |         |  Theme: Project-Specific      |
       |  Audience: Builders / Admins  |         |         |  Audience: Site Visitors      |
       +---------------+---------------+         |         +---------------+---------------+
                       |                         |                         |
              REST / Session API                 |                REST / Visitor API
                       |                         |                         |
                       v                         v                         v
       +-----------------------------------------------------------------------------------+
       |                            SURFACE 2: PLATFORM API                                |
       |                          Rust (Axum + Tokio + SQLx)                               |
       |                                                                                   |
       |  [ Auth & Identity ]  [ Project & Sitemap Engine ]  [ Publication & Release Mgr ] |
       |  [ 4-Tier RBAC ]      [ Schema Conformance Engine ] [ Upstream API Broker ]       |
       +-----------------------------------------+-----------------------------------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                                                   |
                       v                                                   v
       +-------------------------------+                 +---------------------------------+
       |      POSTGRESQL STORAGE       |                 |       UPSTREAM ENTERPRISE       |
       |   Schemas, Pages, Releases,   |                 |         REST SERVICES           |
       |   Encrypted Credentials       |                 |  (Core HR, ERP, Internal APIs)  |
       +-------------------------------+                 +---------------------------------+
```

### Surface 1: The Builder Portal (Next.js App Router)
- **Host Role:** Low-code visual workspace for administrators and developers.
- **Theme:** Authoritative `Enterprise Studio` theme (`enterprise-studio`).
- **Capabilities:** Project creation wizard, sitemap hierarchy tree, 12-column grid visual canvas, dynamic component inspector, API registry manager, and publication center.
- **Security Boundary:** Authenticates using Builder Identity only. Never receives raw upstream secrets or executes customer scripts.

### Surface 2: The Platform API (Rust / Axum / Tokio)
- **Host Role:** Central brain and security fortress.
- **Capabilities:**
  - Manages database persistence via SQLx compile-time checked queries.
  - Houses the **Upstream API Broker**: handles all external API calls with custom DNS resolution (`hickory-resolver`) and strict SSRF defenses.
  - Enforces the 4-tier authorization engine.
  - Manages optimistic locking and presence.
  - Compiles immutable release manifests for publication.

### Surface 3: The Site Runtime (Next.js Manifest-Driven Renderer)
- **Host Role:** High-performance, secure delivery of published websites to external or internal visitors.
- **Theme:** Project-specific website theme rendered via the project's selected component adapter (e.g. `shadcn/ui`).
- **Execution Model:** Completely data-driven from immutable release manifests. Page nodes are pure data ASTs; the renderer executes pre-compiled React components mapped via the adapter.

---

## 2. Published-Site Runtime Architectural Decisions (Section 4.2)

To satisfy Section 4.2 of the Master Prompt, the following four foundational decisions are formally documented and recommended:

### 2.1 Rendering Mode Recommendation
- **Decision:** **Hybrid Rendering Strategy** (Static Generation with On-Demand Revalidation for Public Pages; Server-Side Rendering (SSR) per request for Protected Pages).
- **Technical Rationale:**
  - **Public Pages (Unauthenticated):** Generated statically at publication time and stored at the edge. Revalidated instantly upon release manifest publication. Ensures p95 TTFB < 100ms.
  - **Protected Pages (Authenticated):** Rendered strictly via dynamic Server-Side Rendering (SSR) on each incoming request. The server evaluates visitor session tokens and permissions *before* assembling the DOM or requesting brokered API data.
- **Rejected Alternatives:**
  - *Pure SSR for all pages:* Inefficient for static marketing pages; places unnecessary compute load on the cluster.
  - *Client-Side Rendering (SPA) for protected pages:* Vulnerable to data leakage and violates Section 8 (unauthorized visitors must never receive protected data through prefetches or client caches).

### 2.2 Tenancy Architecture Recommendation
- **Decision:** **Shared Multi-Tenant Renderer Fleet with Hostname-Based Virtual Hosting**.
- **Technical Rationale:**
  - A single horizontally scalable Next.js renderer cluster resolves the project from the incoming `Host` header (e.g., `<project-slug>.sites.example.com`).
  - Fetches the active immutable release manifest from the local Redis/memory cache or Platform API.
  - Drastically lowers resource consumption compared to running an isolated container per project, while maintaining strict memory and data isolation between requests.
- **Isolation Safeguards:** Release manifests are completely isolated; no shared process state or shared user session data exists across tenant boundaries.

### 2.3 Hosting and Domain Strategy
- **Decision:** **Two-Stage Rollout — Platform Subdomains First; Custom Domains with Automated TLS in Phase 5**.
- **Stage 1 (Phases 0–5):** All published sites are served on platform wildcards (`https://<project-identifier>.sites.platform.local` or `*.sites.example.com`).
- **Stage 2 (Phase 6+):** Ingress controller support for custom CNAME mapping with automated ACME/Let's Encrypt TLS certificate provisioning.

### 2.4 Caching & Data Protection Rules
- **Rule 1 (Zero Shared Caching for Protected Resources):** Responses for protected pages and brokered API calls must always include:
  ```http
  Cache-Control: private, no-cache, no-store, must-revalidate, max-age=0
  Pragma: no-cache
  Vary: Cookie, Authorization
  ```
- **Rule 2 (Cache Key Isolation):** Edge caches and CDNs must be explicitly configured to never cache responses where a `Set-Cookie` or `Authorization` header is present.
- **Rule 3 (Server Pre-Render Data Stripping):** If an authenticated visitor lacks component-level permission (e.g. `payroll.read`), the SSR pipeline completely removes the node and its bound payload from the HTML output and JSON hydration script (`__NEXT_DATA__`).

---

## 3. Dual Identity Architecture (Section 4.3)

Builder sessions and Site-Visitor sessions are completely segregated across the entire stack:

| Dimension | Builder Identity Context | Site-Visitor Identity Context |
| :--- | :--- | :--- |
| **Target User** | Platform Admins, Developers, Editors | Employees, Customers, End-Users |
| **Authentication Realm** | Platform Management Realm (Keycloak) | Project-Specific Realm / IdP (OIDC/SAML) |
| **Session Lifetime** | 8 hours (active developer session) | Configurable per project (e.g. 15m to 24h) |
| **Token Delivery** | `HttpOnly`, `SameSite=Lax`, `__Host-platform_session` | `HttpOnly`, `SameSite=Lax`, `__Host-site_session_<proj>` |
| **Permission Scope** | Platform RBAC (`project.create`, `page.save`, `api.register`) | Application RBAC (`managers.read`, `orders.submit`) |
| **Trust Boundary** | Can never access published sites with elevated builder rights | Can never access Platform Builder API or inspect schemas |

---

## 4. Theme and Component Adapter Architecture (Section 4.4)

To prevent coupling between the builder UI and published sites, the system enforces a 5-layer separation:

```
[ Layer 1: Portal Theme ]             --> Enterprise Studio (CSS Tokens in packages/design-system)
                                            ^
                                            | (Strictly Isolated)
                                            v
[ Layer 2: Logical Component Node ]   --> CanvasComponentNode (Canonical JSON Schema in packages/page-schema)
                                            |
[ Layer 3: Component Adapter ]        --> shadcn/ui Component Adapter (packages/component-adapters/shadcn)
                                            |
[ Layer 4: Website Design Theme ]     --> Project Website Theme (CSS custom properties)
                                            |
[ Layer 5: Output HTML / React ]      --> Final DOM rendered by Site Runtime
```

### Component Adapter Scope & Phasing
- **Phase 0–5:** Implement and certify exclusively the **shadcn/ui adapter** (`packages/component-adapters/shadcn`).
- **Post-Phase 6:** Introduce secondary adapters (HeroUI, daisyUI) with formal compatibility matrices.
- **Migration Contract:** Changing a project's component adapter or theme version triggers an automated migration validator that computes property diffs and requires explicit developer preview and sign-off.

---

## 5. Container & Infrastructure Topology (Podman 6.x)

In adherence to Section 3.1, all development, testing, and CI runs rootless under Podman:

```
+------------------------------------------------------------------------------------+
|                         PODMAN ROOTLESS USER POD: visual-platform                  |
|                                                                                    |
|  +---------------------------+   +---------------------------+   +---------------+ |
|  |     platform-api          |   |      postgres-db          |   |   keycloak    | |
|  |  Rust Axum Service        |   |  PostgreSQL 18 Alpine     |   |   OIDC 26.7   | |
|  |  Port: 8080               |   |  Port: 5432               |   |   Port: 8443  | |
|  +-------------+-------------+   +-------------+-------------+   +-------+-------+ |
|                |                               |                         |         |
|                +---------------+---------------+-------------------------+         |
|                                |                                                   |
|  +-----------------------------+-----------------------------+                     |
|  |                   test-upstream-api                       |                     |
|  |        Mock HR & Employee Directory (Port: 9090)          |                     |
|  +-----------------------------------------------------------+                     |
+------------------------------------------------------------------------------------+
```

- **Container-to-Host Communication:** Uses `host.containers.internal`.
- **Testcontainers Integration:** User socket `\\.\pipe\podman-machine-default` on Windows / `/run/user/1000/podman/podman.sock` on Linux with `TESTCONTAINERS_RYUK_DISABLED="true"`.
- **Labeling Standard:** All test-spawned containers carry `visual-platform.test=true`.
