# Guideline: Desktop Studio Canvas & 12-Column Grid

- **Task ID:** `TSK-0B-01`
- **Phase:** Phase 0B
- **Domain:** Visual Studio & Canvas Architecture

---

## Architectural Principles & Invariants

1. **Normalized Grid Properties Only:**
   - In accordance with Section 6.4, the canvas stores strictly normalized CSS Grid attributes: `colStart` (1–12), `colSpan` (1–12), `rowStart`, `rowSpan`, alignment, and pixel minimum height.
   - Never generate or persist arbitrary unstructured CSS strings inside component schemas.

2. **Immutable Command History for Undo/Redo:**
   - All state modifications (dragging, resizing, updating props) must push a deep snapshot onto the undo stack and clear the redo stack.
   - State mutations must never mutate existing node references in-place.

3. **Responsive Breakpoint Inheritance:**
   - The `desktop` viewport represents the single source of truth base layout.
   - `tablet` and `mobile` viewports inherit desktop properties and specify only explicit overrides (e.g. `colSpan: 12` on mobile) via the `responsive` record.

4. **Permanent & Stable Component Identifiers:**
   - Node IDs (e.g. `node-employee-table`) must remain constant across moves, re-parenting, undo/redo passes, and property changes.
   - Component IDs are never regenerated during visual editing sessions.

5. **Bidirectional (RTL) Layout Symmetry:**
   - Under RTL mode (`dir="rtl"`), the 12-column grid visual sequence mirrors naturally (Column 1 on visual right).
   - Horizontal drag deltas must be inverted (`-deltaX`) to ensure intuitive cursor tracking.
