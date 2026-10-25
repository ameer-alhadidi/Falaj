# Falaj — Enterprise Visual Platform

> A schema-driven, multi-tenant visual website development platform with strict 3-tier persona separation, dual-language RFC 9535 data binding, and server-enforced security policies.

---

## Architecture Overview

Falaj is architected around a strict 3-tier persona separation of concerns:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        3-TIER PERSONA ARCHITECTURAL FLOW                                │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│ Tier 1: Administrator    │ Tier 2: Builder Studio      │ Tier 3: Developer Engine      │
│ (Component Governance)   │ (Canvas Assembly & Drop)    │ (Data Binding & Mutations)    │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ • ShieldCheck Admin Modal│ • HeroUI Component Drawer   │ • RFC 9535 JSONPath Mapping   │
│ • Project-level allow/   │   - All Components (React)  │   ($.data.employee[field])    │
│   restrict policy switch │   - Form Controls & Layout  │ • Outbound Mutation Endpoints │
│ • Locks restricted items │   - New / Updated Badges    │   (POST/PUT /api/employees)   │
│   with amber warning     │ • 12-Col Form Drop Container│ • Live Payload Preview &      │
│   and lock icon          │ • Drag & Drop / Click to Add│   Upstream Dry-Run Simulator  │
└──────────────────────────┴─────────────────────────────┴───────────────────────────────┘
```

---

## Monorepo Layout

```
Falaj/
├── .github/workflows/          # CI pipeline (cargo clippy, nextest, audit, deny, prettier)
├── compose.yaml                # Rootless Podman compose (Postgres 18, Keycloak 26.7)
├── containers/                 # Multi-stage Containerfiles for platform services
├── crates/
│   └── page-schema/            # Core Rust CanvasComponentNode & RFC 9535 AST models
├── database/
│   └── migrations/             # SQLx migrations (tenants, users, pages, audit)
├── docs/                       # Architectural blueprints, security, and data models
├── ext/
│   ├── kanban.html             # Interactive dark/light phase-gated Kanban board
│   ├── kanban.md               # Markdown companion task board
│   ├── how-to-guide.md         # Comprehensive platform cookbook
│   └── guidelines/             # Per-task guideline packages (guideline, example, how-to, tests)
├── packages/
│   └── design-system/          # @falaj/design-system (Enterprise Studio tokens & styles)
├── prototypes/
│   ├── prototype-1-studio/     # Desktop Studio (HeroUI drawer, Form drop, 12-col grid) [Port 3001]
│   ├── prototype-2-data-mapping/# API & Data-Binding Matrix (RFC 9535 live repeater)   [Port 3002]
│   └── prototype-3-admin/      # Admin & Security Gateway (Vault, governance, audit)   [Port 3003]
└── services/
    └── platform-api/           # Rust Platform API Service (Axum 0.8, Tokio 1.43)
```

---

## Prerequisites & Toolchain

- **Rust:** `1.99+` (with `cargo`, `rustfmt`, `clippy`, `cargo-nextest`, `sqlx-cli`, `cargo-audit`, `cargo-deny`)
- **Node.js:** `v24+` with **pnpm** `v11+`
- **Containers:** Rootless **Podman** `6.0+` with `podman-compose`

---

## Quick Start

### 1. Install Dependencies & Build Packages
```bash
# Install workspace npm dependencies
pnpm install

# Build design system package
pnpm run build:packages
```

### 2. Verify Toolchain & Quality Gates
```bash
# Rust workspace verification
cargo check --workspace
cargo nextest run --workspace
cargo clippy --all-targets --all-features -- -D warnings

# Code style formatting check
pnpm run format:check
```

### 3. Launch Development Prototypes
```bash
# Prototype 1: Phase 3 Studio (HeroUI Drawer & 12-Col Grid)
pnpm --filter prototype-1-studio dev    # http://localhost:3001

# Prototype 2: Data-Binding Matrix
pnpm --filter prototype-2-data-mapping dev # http://localhost:3002

# Prototype 3: Admin & Security Gateway
pnpm --filter prototype-3-admin dev    # http://localhost:3003
```

---

## Documentation & Phase Guidelines

- **Interactive Kanban:** [`ext/kanban.html`](ext/kanban.html)
- **Cookbook & How-To:** [`ext/how-to-guide.md`](ext/how-to-guide.md)
- **System Specifications:** [`docs/`](docs/)
  - [Product Requirements](docs/product-requirements.md)
  - [System Architecture](docs/architecture.md)
  - [Security Model & SSRF Broker](docs/security-model.md)
  - [Page Schema Specification](docs/page-schema.md)
  - [Theme System & WCAG 2.2 AA Audit](docs/theme-system.md)
  - [Data Model & Migrations](docs/data-model.md)

---

## License

Dual-licensed under MIT OR Apache-2.0.
