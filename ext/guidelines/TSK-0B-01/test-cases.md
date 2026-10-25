# Test Cases: Desktop Studio Canvas

- **Task ID:** `TSK-0B-01`
- **Domain:** Verification & Test Scenarios

---

## Test Scenario Matrix

| Test ID | Test Scenario | Execution Steps | Expected Result | Pass Criteria |
| :--- | :--- | :--- | :--- | :--- |
| `TC-0B-01.1` | Next.js Production Build | `pnpm --filter prototype-1-studio build` | `Compiled successfully`, `Generating static pages (4/4)` | Exits with code 0, 0 type errors |
| `TC-0B-01.2` | 12-Column Guide Rendering | Navigate to `http://localhost:3001`, observe overlay | 12 vertical column tracks numbered 1 to 12 | Column guides visible with dashed borders |
| `TC-0B-01.3` | Viewport Scale Adjustment | Click `Tablet (768px)` button in top toolbar | Canvas width resizes to `768px` | Canvas frame bounded with smooth transition |
| `TC-0B-01.4` | Live Property Mutability | Change table empty text in inspector | Canvas updates live without page reload | Real-time DOM reflection |
| `TC-0B-01.5` | Command History Undo Stack | Modify column span, click Undo icon | Canvas reverts to prior column span | Save status updates to 'Unsaved changes' |
| `TC-0B-01.6` | Theme Mode Switching | Click Sun/Moon icon in toolbar | `<html>` attribute switches `data-theme="light"` | All surface colors update without FOUC |
| `TC-0B-01.7` | Bidirectional RTL Mirroring | Click `LTR (English)` toggle | `<html>` switches to `dir="rtl"` | Toolbars, sidebars, and grid columns invert |
