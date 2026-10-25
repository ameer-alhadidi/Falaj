# Guideline: Context7 MCP Smoke Testing & Authoritative Documentation

- **Task ID:** `TSK-P1-03`
- **Phase:** Phase −1
- **Domain:** Tooling & Up-to-Date Architecture

---

## Architectural Principles & Invariants

1. **Live Documentation Grounding:**
   - Agents and developers must query Context7 live documentation MCP before designing integrations with modern frameworks (Axum, Tokio, SQLx, Next.js, shadcn/ui).
   - Never write code from stale model memory when authoritative library documentation is available via Context7.

2. **Resolution Protocol:**
   - Always run `resolve-library-id` with the library name and semantic query before calling `query-docs`.
   - Record the resolved canonical library ID (e.g. `/tokio-rs/axum`) in architecture notes.
