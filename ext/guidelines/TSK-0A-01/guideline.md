# Guideline: System Blueprints & Core Schemas

- **Task ID:** `TSK-0A-01`
- **Phase:** Phase 0A
- **Domain:** Data Modeling & Page Schema Architecture

---

## Architectural Principles & Invariants

1. **Non-Executable Page AST Invariant:**
   - Visual pages are stored strictly as declarative AST JSON objects conforming to `CanvasComponentNode`.
   - Never store arbitrary or executable JavaScript inside page nodes.
   - Any client-side interactions are represented via predefined, bounded action payloads.

2. **Optimistic Concurrency Control:**
   - Page saves require checking monotonic integer `version_number BIGINT`.
   - Conflicting writes (`current_version != expected_version`) must be rejected with HTTP 409 Conflict.

3. **Relational Data Integrity:**
   - Multi-tenant isolation at the database level with foreign keys cascading from `tenants` and `projects`.
   - Primary keys use UUIDv4 (`gen_random_uuid()`).
