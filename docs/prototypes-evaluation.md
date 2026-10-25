# Phase 0B Prototypes Evaluation & Architecture Recommendation
## Enterprise Visual Website Development Platform

- **Status:** Completed (Phase 0B)
- **Author:** Lead Systems Architect & Product Designer
- **Prototypes Built:** 3 Independent Next.js Applications
- **Design System Consumed:** `packages/design-system` (Enterprise Studio Tokens)

---

## 1. Executive Summary & Verification Overview

During Phase 0B, three interactive, independently runnable Next.js prototypes were engineered and tested:
1. **Prototype 1 — Desktop Studio (`prototypes/prototype-1-studio`):** Visual 12-column grid canvas, guide overlays, left sitemap/toolbox, right property & grid inspector, employee directory table rendering, and responsive viewport simulator.
2. **Prototype 2 — API & Data-Binding Matrix (`prototypes/prototype-2-data-mapping`):** Expandable sanitized JSON tree, RFC 9535 binding connectors (`$` root, `@` item), live syntax validator, and repeated table row preview with simulated states (Default, Loading, Empty, Error).
3. **Prototype 3 — Admin & Security Gateway (`prototypes/prototype-3-admin`):** Project quotas & restrictions governance, write-only credential vault (AES-256-GCM envelope encryption status), dual identity segregation (Builder vs. Site-Visitor), and immutable audit trail.

All three prototypes strictly consume tokens from [`packages/design-system`](file:///d:/work/Falaj/packages/design-system) and conform to the `CanvasComponentNode` schema approved in Phase 0A.

---

## 2. Startup Instructions & Independent Execution

Each prototype has its own dedicated script and local port:

| Prototype | Port | Dev Command | Production Start Command |
| :--- | :--- | :--- | :--- |
| **Prototype 1 (Studio)** | `3001` | `pnpm --filter prototype-1-studio dev` | `pnpm --filter prototype-1-studio start` |
| **Prototype 2 (Data Binding)** | `3002` | `pnpm --filter prototype-2-data-mapping dev` | `pnpm --filter prototype-2-data-mapping start` |
| **Prototype 3 (Admin Gateway)** | `3003` | `pnpm --filter prototype-3-admin dev` | `pnpm --filter prototype-3-admin start` |

Alternatively, run from workspace root:
```powershell
# Run Prototype 1 (Desktop Studio)
pnpm dev:proto1

# Run Prototype 2 (Data-Binding Matrix)
pnpm dev:proto2

# Run Prototype 3 (Admin Gateway)
pnpm dev:proto3
```

---

## 3. Comparison with Usability and Implementation Trade-offs

| Evaluation Dimension | Prototype 1 (Desktop Studio) | Prototype 2 (Data Matrix) | Prototype 3 (Admin Console) |
| :--- | :--- | :--- | :--- |
| **Primary Interaction Model** | Visual direct-manipulation on 12-column grid canvas with real-time property inspector. | Declarative mapping connectors between JSON AST and component data slots. | Form-based enterprise governance, quota toggles, and security policy control. |
| **Cognitive Load** | Low for layout designers; higher when managing deep nesting and column span math. | Extremely low: visual field projection with immediate live row feedback eliminates syntax guessing. | Low: clear tabbed division of admin responsibilities with write-only credential protection. |
| **Implementation Complexity** | **High:** Requires `@dnd-kit` collision algorithms, keyboard sensors, undo/redo stacks, and viewport frame scaling. | **Medium:** Requires AST path parsing, live validation error feedback, and virtualized JSON trees. | **Low–Medium:** Standard relational forms, table filters, and modal workflows. |
| **Performance Profile** | Dependent on canvas node count; virtualized rendering required beyond 300 nodes. | Linear $O(N)$ evaluation time; parsing is fast (<1ms per path). | Negligible client load; paginated server queries. |
| **A11y & Bidirectional Support** | Full LTR/RTL grid mirroring; requires keyboard sensor for drag-and-drop. | Bidirectional tree connectors and text projection. | Clean semantic HTML forms, accessible dialogs, and RTL mirroring. |

---

## 4. Architectural Recommendation & Unified Direction

### Recommendation: Unified Studio Architecture with Modal Data Matrix
Rather than forcing developers to jump between completely disjoint apps in production:
1. **Core Workspace:** The **Desktop Studio (Prototype 1)** serves as the primary canvas workspace for page layout and visual assembly.
2. **Integrated Data Binding Drawer:** The **API & Data-Binding Matrix (Prototype 2)** is invoked as an intelligent flyout drawer or modal when configuring a collection component (Table, Repeater, Form). This gives developers the full visual power of JSON tree mapping without losing canvas context.
3. **Dedicated Admin Portal:** The **Admin & Security Gateway (Prototype 3)** remains a dedicated administrative surface accessible only to users with the `platform_admin` role, guaranteeing separation of duties.

---

## 5. Known Limitations & Technical Debt in Prototypes
1. **Mock Data Fixtures:** All prototypes currently render frozen JSON fixtures (`fixtures/*.json`). Real persistence and broker proxying will be wired in Phase 1 and Phase 4.
2. **Drag Sensor Collision:** Dragging in Prototype 1 currently simulates insertion via clicks; full `@dnd-kit` pointer and keyboard sensors will be formally implemented in Phase 3.
3. **WASM Path Evaluator:** Path evaluation in Prototype 2 uses the client-side JavaScript regex engine; Phase 4 will replace this with the compiled Rust WASM / shared conformance parser.
