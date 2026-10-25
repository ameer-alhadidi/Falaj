# Guideline: Enterprise Studio Design System Distribution

- **Task ID:** `TSK-01-04`
- **Phase:** Phase 1
- **Domain:** Frontend Design System & Token Packaging

---

## Architectural Principles & Invariants

1. **Single Source of Truth:**
   - All styling tokens reside canonically in `packages/design-system/src/tokens.css`.
   - Never define ad-hoc color variables or un-tokenized CSS rules inside individual apps.

2. **Zero Hardcoded Colors:**
   - Applications must import and consume CSS custom properties exclusively.
   - Any raw `#hex`, `rgb()`, or `hsl()` in consumer components fails pre-commit lint.

3. **Theme & Direction Isolation:**
   - Tokens support `light` and `dark` themes via data attributes (`[data-theme="light"]`, `[data-theme="dark"]`).
   - Bidirectional spacing via CSS logical properties (`margin-inline-start`, `padding-inline-end`).
