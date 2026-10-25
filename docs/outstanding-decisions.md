# Outstanding Decisions and Architectural Records

This document records architectural, tooling, and design decisions made throughout the project lifecycle. In accordance with Section 0 and Section 1 of the Master Prompt, any notable choices within the stated stack and reversible implementation details are recorded here with rationale.

---

## Tooling & Infrastructure Decisions (Phase −1)

### DEC-001: Container Runtime & Engine Selection
- **Status:** Decided
- **Date:** 2026-10-25
- **Decision:** Use rootless Podman 6.0.2 with `podman-compose` 1.6.0 on Windows (WSL2-backed default machine `podman-machine-default`).
- **Rationale:** Strict adherence to Master Prompt Section 3.1. Windows host communicates through named pipe `\\.\pipe\podman-machine-default` and SSH-tunneled socket `/run/user/1000/podman/podman.sock`.
- **Reversibility:** Low (core architectural constraint).

### DEC-002: Testcontainers Socket Configuration
- **Status:** Decided
- **Date:** 2026-10-25
- **Decision:** Set `TESTCONTAINERS_RYUK_DISABLED="true"` and label all test containers with `visual-platform.test=true`.
- **Rationale:** Ryuk is known to have instability under rootless container engines. Using explicit container labels and cleanup targets (`make test-clean`) ensures deterministic, leak-free test environments.
- **Reversibility:** High (can be tuned or adapted per platform).

### DEC-003: Cargo Tooling Installation Strategy
- **Status:** Decided
- **Date:** 2026-10-25
- **Decision:** Install development CLI utilities (`cargo-nextest`, `sqlx-cli`, `cargo-audit`, `cargo-deny`) using official package managers and precompiled binaries (`winget` and `cargo-binstall`) rather than compiling from source.
- **Rationale:** Dramatically accelerates initial environment provisioning and CI container image build times without compiling heavy native dependencies locally.
- **Reversibility:** High.

### DEC-004: Dual Customization Discovery Roots
- **Status:** Decided
- **Date:** 2026-10-25
- **Decision:** Maintain project skills in both `.claude/skills/` (as specified in Master Prompt Sections 2.4 and 13) and `.agents/skills/` (for Antigravity IDE workspace customization root compatibility).
- **Rationale:** Guarantees standard cross-tool compatibility and zero-configuration discovery across both Claude-native runners and Antigravity IDE agents.
- **Reversibility:** High.

### DEC-005: Bidirectional & Accessibility Project Skills Addition
- **Status:** Decided
- **Date:** 2026-10-25
- **Decision:** Add `arabic-rtl-engineering` and `wcag-accessibility-audit` to the core project skills, and schedule `next-devtools-mcp` (Phase 0B) and `@modelcontextprotocol/server-postgres` (Phase 1) on a phase-gated schedule.
- **Rationale:** Section 5.3 mandates full Arabic/English bidirectional support across the grid, sitemap, inspector, and published sites. Section 5.1 and 6.4 mandate WCAG 2.2 AA and keyboard-only canvas manipulation. Authoring these skills early prevents styling and accessibility regressions before Phase 0A design docs.
- **Reversibility:** High.

---

## Architecture & System Design Decisions (Phase 0A)

### DEC-006: Hybrid Site Runtime Rendering Strategy
- **Status:** Decided
- **Date:** 2026-10-25
- **Decision:** Use Hybrid Rendering in the published site runtime: Static Generation with on-demand revalidation for unauthenticated public pages; Dynamic Server-Side Rendering (SSR) per request for authenticated/protected pages.
- **Rationale:** Fulfills Section 4.2. Ensures p95 TTFB < 100ms for marketing/public content while guaranteeing that protected pages evaluate visitor credentials, permissions, and brokered data dynamically without caching risks.
- **Reversibility:** Medium (isolated to site renderer application).

### DEC-007: Multi-Tenant Hostname-Based Virtual Hosting
- **Status:** Decided
- **Date:** 2026-10-25
- **Decision:** Deploy a shared horizontally scalable Next.js renderer fleet resolving tenant projects via the incoming `Host` header (`<project>.sites.example.com`).
- **Rationale:** Fulfills Section 4.2. Maximizes resource efficiency and reduces container operational overhead compared to dedicated container per project.
- **Reversibility:** High (release manifests are decoupled data structures).

### DEC-008: Two-Stage Hosting & Domain Rollout
- **Status:** Decided
- **Date:** 2026-10-25
- **Decision:** Support platform wildcard subdomains exclusively through Phases 0–5; introduce custom domains with automated TLS certificate management in Phase 6.
- **Rationale:** Fulfills Section 4.2. Eliminates external DNS/TLS certificate provisioning friction during core platform build and initial prototypes.
- **Reversibility:** High.

### DEC-009: Zero Shared Caching for Authenticated Pages
- **Status:** Decided
- **Date:** 2026-10-25
- **Decision:** Enforce `Cache-Control: private, no-store, no-cache` and strict `Vary: Cookie` headers on all protected page responses and brokered API calls. Strip unauthorized components from server HTML and hydration scripts before transmission.
- **Rationale:** Fulfills Sections 4.2, 7.2, and 8. Guarantees that protected data can never leak between users through intermediate proxy caches or browser history.
- **Reversibility:** Low (fundamental security requirement).

### DEC-010: Exclusive Focus on shadcn/ui Component Adapter
- **Status:** Decided
- **Date:** 2026-10-25
- **Decision:** Implement and support exclusively the `shadcn/ui` component adapter through Phase 5. Defer HeroUI and daisyUI adapters to post-Phase 6.
- **Rationale:** Fulfills Section 4.4. Concentrating on a single, high-quality Tailwind/Radix UI adapter guarantees rock-solid WCAG 2.2 AA compliance, bidirectional RTL support, and fast iteration.
- **Reversibility:** Medium.

### DEC-011: RFC 9535 Binding Path Grammar with `@` Item Root
- **Status:** Decided
- **Date:** 2026-10-25
- **Decision:** Standardize on a strict, security-reviewed subset of RFC 9535 syntax with `@` as a standalone item-relative root for repeated templates, verified by dual-language conformance tests in Rust and TypeScript.
- **Rationale:** Fulfills Section 7.3. Eliminates arbitrary expression evaluation vulnerabilities while providing an intuitive, declarative syntax for mapping REST API collections and fields.
- **Reversibility:** Low (core schema format).

### DEC-012: Custom DNS Resolver via `hickory-resolver` for SSRF Defense
- **Status:** Decided
- **Date:** 2026-10-25
- **Decision:** Equip the backend `reqwest` HTTP client with a custom resolver built on `hickory-resolver` that validates resolved IPs against a comprehensive blocklist before socket handoff, while preserving TLS SNI and certificate hostname verification.
- **Rationale:** Fulfills Section 7.2. Completely closes the Time-of-Check to Time-of-Use (TOCTOU) DNS rebinding gap without breaking TLS security.
- **Reversibility:** Low (core security architecture).


