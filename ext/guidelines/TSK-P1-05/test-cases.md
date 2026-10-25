# Test Cases: Decision & Tooling Document Consistency

- **Task ID:** `TSK-P1-05`
- **Domain:** Documentation Verification

---

## Documentation Verification Checks

1. **TC-DOC-01: File Existence:**
   - Verify `docs/tooling.md` exists and contains toolchain table.
   - Verify `docs/outstanding-decisions.md` exists.

2. **TC-DOC-02: Decision Numbering Sequence:**
   - Verify decisions are monotonically numbered (`DEC-001`, `DEC-002`, ...).
   - Ensure every decision contains required fields (`Status`, `Date`, `Decision`, `Rationale`, `Reversibility`).
