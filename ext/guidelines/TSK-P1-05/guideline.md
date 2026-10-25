# Guideline: Architectural Decisions & Tooling Documentation

- **Task ID:** `TSK-P1-05`
- **Phase:** Phase −1
- **Domain:** Architecture Governance & Documentation

---

## Architectural Principles & Invariants

1. **Lightweight ADR Structure:**
   - Every significant technical decision must be appended to `docs/outstanding-decisions.md`.
   - Each entry must specify:
     - Identifier: `DEC-XXX`
     - Status: `Proposed` | `Decided` | `Superseded`
     - Context & Trade-offs
     - Reversibility Assessment (High / Medium / Low)

2. **Tooling Specification Maintenance:**
   - Maintain `docs/tooling.md` as the authoritative catalog of tool versions, system requirements, and installation recipes.
