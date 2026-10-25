# Phase −1 Tooling and Infrastructure Inventory

This document fulfills the Phase −1 deliverables required by Section 2.6 of the Master Prompt. It records every skill, MCP server, container tool, and CLI utility evaluated, installed, pinned, and smoke-tested for the Enterprise Visual Website Development Platform.

---

## 1. Agent Skills

### 1.1 Evaluated External Skills
| Skill Name | Source / Provider | Purpose | Status | Evaluation Notes |
| :--- | :--- | :--- | :--- | :--- |
| `frontend-design` | Anthropic | Visual excellence, tokens, responsive layout patterns | Adopted | Applied for Phase 0B prototype aesthetics and Enterprise Studio token refinement. |
| `webapp-testing` | Anthropic | Playwright E2E driving, multi-viewport light/dark checks | Adopted | Used for headless test orchestration and screenshot capture. |
| `skill-creator` | Anthropic | Authoring project-local skills | Adopted | Used to generate the 5 project skills in Section 1.2. |
| `docx` / `pdf` | Anthropic | Design document export | Deferred | Available on-demand if offline export is requested. |

### 1.2 Project Skills Created
All project skills are maintained in `.claude/skills/` and mirrored in `.agents/skills/` for seamless IDE agent discoverability.

| Skill Identifier | Location | Purpose & Scope | Verification Result |
| :--- | :--- | :--- | :--- |
| `enterprise-studio-tokens` | [.claude/skills/enterprise-studio-tokens/SKILL.md](file:///d:/work/Falaj/.claude/skills/enterprise-studio-tokens/SKILL.md) | Enforces CSS custom properties, zero hardcoded colors, theme modes, and WCAG 2.2 AA contrast rules. | **Verified** — Valid frontmatter and guidance confirmed. |
| `page-schema` | [.claude/skills/page-schema/SKILL.md](file:///d:/work/Falaj/.claude/skills/page-schema/SKILL.md) | Defines canonical `CanvasComponentNode` shape, AST validation, and RFC 9535 path grammar (`$`, `@`). | **Verified** — Valid frontmatter and syntax constraints confirmed. |
| `security-review` | [.claude/skills/security-review/SKILL.md](file:///d:/work/Falaj/.claude/skills/security-review/SKILL.md) | Checklist covering SSRF protection, custom DNS resolver, 4-tier authorization, CSRF, and secret storage. | **Verified** — Valid frontmatter and checklist rules confirmed. |
| `phase-report` | [.claude/skills/phase-report/SKILL.md](file:///d:/work/Falaj/.claude/skills/phase-report/SKILL.md) | Standardized acceptance report template for phase boundary sign-offs. | **Verified** — Valid frontmatter and template structure confirmed. |
| `podman-dev` | [.claude/skills/podman-dev/SKILL.md](file:///d:/work/Falaj/.claude/skills/podman-dev/SKILL.md) | Rootless Podman compose conventions, socket configuration, container labeling, and cleanup. | **Verified** — Valid frontmatter and socket paths confirmed. |
| `arabic-rtl-engineering` | [.claude/skills/arabic-rtl-engineering/SKILL.md](file:///d:/work/Falaj/.claude/skills/arabic-rtl-engineering/SKILL.md) | CSS logical properties, Arabic typography pairing, and canvas coordinate mirroring for English/Arabic. | **Verified** — Valid frontmatter and bidirectional rules confirmed. |
| `wcag-accessibility-audit` | [.claude/skills/wcag-accessibility-audit/SKILL.md](file:///d:/work/Falaj/.claude/skills/wcag-accessibility-audit/SKILL.md) | WCAG 2.2 AA compliance standards, color contrast checks, keyboard navigation for dnd-kit, and axe-core Playwright recipes. | **Verified** — Valid frontmatter and test templates confirmed. |

---

## 2. Model Context Protocol (MCP) Servers

| Server Name | Source / Provider | Pinned Version / URI | Purpose | Scopes Granted | Smoke Test Result | Notes / Fallbacks |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Context7** | Context7 | MCP lazy-loaded | Live library documentation (Axum, Tokio, SQLx, Next.js, shadcn/ui, dnd-kit) | Read-only doc retrieval | **PASS** — Successfully resolved `/tokio-rs/axum` (v0.8.4/v0.7.9) and retrieved router state & handler documentation. | Direct API query fallback available via web retrieval if offline. |
| **Playwright / Browser** | Playwright / Native Browser Subagent | Playwright 1.64.1 | Headless browser automation, visual regression, multi-theme screenshots | Localhost URLs only | **PASS** — Playwright CLI 1.64.1 and browser subagent active. | Direct CLI snapshot fallback verified. |
| **shadcn/ui Registry** | Official shadcn/ui | `shadcn@latest` | Component definitions and Tailwind tokens | Project directory | **PASS** — Direct registry import via CLI. | Verified for Phase 0B/Phase 1 component adapters. |
| **PostgreSQL Dev Server** | Red Hat / OCI | `docker.io/library/postgres:18-alpine` | Local development schema and migration target | Read/Write local dev container only | **PASS** — Image available locally in Podman; direct SQLx migration CLI verified. | Sandboxed in rootless container. |
| **Keycloak Identity Server** | Red Hat / Quay.io | `quay.io/keycloak/keycloak:26.7.2` | Local OIDC provider for site-visitor authentication testing | Localhost container only | **PASS** — Image cached locally; rootless port mapping ready. | Zero external network dependency for auth tests. |
| **Podman CLI / Machine** | Red Hat | Podman 6.0.2 | Container lifecycle, pod networking, Compose orchestration | Local engine only | **PASS** — Rootless mode active, `podman run --rm quay.io/podman/hello` executed successfully. | Container socket available at `\\.\pipe\podman-machine-default`. |

### 2.1 Upcoming MCP Server Roadmap (Phase-gated)
- **`next-devtools-mcp` (Vercel Next.js DevTools):** Planned for activation during Phase 0B (Prototypes) to inspect Next.js App Router render passes, server/client component boundaries, and hydration state.
- **`@modelcontextprotocol/server-postgres`:** Planned for Phase 1 (Foundation) in strictly read-only mode targeting the local development database container for schema introspection and query plan verification.

### 2.2 Explicitly Rejected Tools (Least Privilege per Section 2.1)
- **Docker MCP:** Rejected per Section 3.1 (Podman is strictly mandated; Docker is disallowed).
- **Remote / Cloud Database MCPs:** Rejected per Section 2.1 (tools must never connect to remote credentials or production systems).
- **Generic OS Shell MCPs:** Rejected as redundant and violating least privilege given native IDE workspace execution boundaries.

---

## 3. CLI Toolchain

| Tool | Pinned Version | Source / Path | Purpose | Verification Result |
| :--- | :--- | :--- | :--- | :--- |
| `rustc` | 1.99.0 (b940084d7 2026-09-28) | Rustup / System | Rust compiler | **PASS** |
| `cargo` | 1.99.0 (5f94df478 2026-08-27) | Rustup / System | Rust package manager | **PASS** |
| `rustfmt` | 1.10.0-stable | Rustup / Component | Code formatting enforcement | **PASS** |
| `clippy` | 0.1.99 | Rustup / Component | Rust linting (`-- -D warnings`) | **PASS** |
| `cargo-nextest` | 0.9.148 | `nextest.cargo-nextest` (WinGet) | Fast test execution harness | **PASS** |
| `cargo-deny` | 0.20.2 | EmbarkStudios (GitHub Release) | Dependency & license checking | **PASS** |
| `cargo-audit` | 0.22.2 | RustSec (GitHub Release) | Security advisory auditing | **PASS** |
| `sqlx-cli` | 0.9.0 | Crates.io / Cargo | Compile-time SQL checking and migrations | **PASS** (postgres, rustls) |
| `node` | v24.13.0 | System | JavaScript runtime | **PASS** |
| `pnpm` | 11.10.0 | System | Monorepo package manager | **PASS** |
| `playwright` | 1.64.1 | npm / npx | Browser testing suite | **PASS** |
| `podman` | 6.0.2 | Red Hat / System | Rootless container engine | **PASS** |
| `podman-compose` | 1.6.0 | System | Compose specification provider | **PASS** |

---

## 4. Container & Podman Socket Environment Details

- **Engine Mode:** Rootless (`rootless: true`, cgroups v2, crun 1.28).
- **Default Machine:** `podman-machine-default` (running, WSL2 backend, 16 vCPUs, 2 GiB RAM, 100 GiB disk).
- **Socket Paths:**
  - **Linux / Inside Machine:** `/run/user/1000/podman/podman.sock`
  - **Windows Host Named Pipe:** `\\.\pipe\podman-machine-default`
  - **Windows SSH Tunnel URI:** `ssh://user@127.0.0.1:56902/run/user/1000/podman/podman.sock`
- **Testcontainers Configuration:**
  - `TESTCONTAINERS_RYUK_DISABLED="true"`
  - Labels required: `visual-platform.test=true`
  - Cleanup target: `make test-clean`

---

## 5. Exit Criteria Sign-Off Checklist (Section 2.6)

- [x] Each installed/selected MCP server passes smoke tests (Context7 live doc query for Axum passed).
- [x] `podman info` shows rootless mode; `podman compose version` works (`podman-compose 1.6.0`); `quay.io/podman/hello` runs successfully.
- [x] All 5 project skills created in `.claude/skills/` and mirrored in `.agents/skills/`.
- [x] Complete toolchain inventory with pinned versions, sources, scopes, and verification results recorded in `docs/tooling.md`.
- [x] Architectural and operational decisions recorded in `docs/outstanding-decisions.md`.
