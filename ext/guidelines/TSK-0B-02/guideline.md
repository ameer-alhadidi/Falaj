# Guideline: API & Data-Binding Matrix

- **Task ID:** `TSK-0B-02`
- **Phase:** Phase 0B
- **Domain:** Expression Parsing & Data Binding

---

## Architectural Principles & Invariants

1. **Strict RFC 9535 Syntax Invariants:**
   - In accordance with Section 7.3, all binding expressions strictly adhere to project-defined RFC 9535 subset rules.
   - `$` is reserved exclusively for the API response root (e.g. `$.data`, `$.total`).
   - `@` is a standalone item-relative root for elements inside a repeated template (e.g. `@.department.name`).

2. **Prohibited Language Features (Security & ReDoS Gate):**
   - Filter expressions (`?()`), function extensions (`match`, `search`), recursive descent (`..`), and negative indices are forbidden.
   - Input expressions must be validated at authoring time; invalid expressions must block saving.

3. **Separation of Mapping Definitions from Data:**
   - Page definitions persist **only mapping strings** (e.g. `{"department": "@.department.name"}`), never live API payloads.
   - Raw enterprise data is retrieved and projected exclusively at render time by the server broker.

4. **Mandatory 4-State UI Contract:**
   - Every data-bound component must provide explicit UI states and error handling:
     1. **Default:** Live repeated items mapped from collection array.
     2. **Loading:** Skeleton/spinner while broker awaits upstream response.
     3. **Empty:** Graceful empty state when array contains 0 items.
     4. **Error:** Controlled fallback alert when upstream returns 4xx/5xx or broker timeout occurs.
