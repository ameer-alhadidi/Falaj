# Test Cases: HeroUI Drawer, Admin Governance & Form Canvas

- **Task ID:** `TSK-03-02`
- **Phase:** Phase 3
- **Test Target:** `prototypes/prototype-1-studio` on `http://localhost:3001/`

---

## Acceptance Test Suite

| Test ID | Category | Scenario / Action | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-03-01` | HeroUI Aesthetics | Verify HeroUI drawer rendering and status badges | Shows "All Components (React)" top pill with count, categorized sections, `New` badge on `AvatarGroup`, `Updated` badge on `Calendar`, `Checkbox`, `Autocomplete`. | Pass |
| `TC-03-02` | Admin Governance | Restrict a component via Admin modal | Opening modal, toggling `Autocomplete` to restricted, updates HeroUI drawer with amber `Restricted` badge and lock icon. | Pass |
| `TC-03-03` | Admin Enforcement | Attempt to drop restricted component | Clicking or dragging restricted component shows administrator policy restriction notice; component is not added to form. | Pass |
| `TC-03-04` | Builder Form Drop | Drag allowed component into Form container | Dropping `Calendar` or `Input` into Form container appends new child field with unique ID, column span, and reactive focus. | Pass |
| `TC-03-05` | Canvas Grid Layout | Resize dropped form field column span | Changing column span slider from 6 to 12 updates subgrid spanning immediately in canvas and state. | Pass |
| `TC-03-06` | Developer Binding | Inspect form field data-binding | Selecting form field and opening "Binding (Phase 5)" tab displays RFC 9535 path (`$.data.employee[field]`) and synthesized outbound JSON. | Pass |
| `TC-03-07` | RTL Layout Mirroring | Toggle Arabic RTL mode | Entire UI (drawer, guides, canvas, form fields, inspector) mirrors logically; Arabic typography (`IBM Plex Sans Arabic`) activates. | Pass |
| `TC-03-08` | Theme Consistency | Toggle Dark / Light theme | All surfaces, borders, and text adhere to `--portal-*` CSS variables without hardcoded hex colors or contrast regressions. | Pass |
