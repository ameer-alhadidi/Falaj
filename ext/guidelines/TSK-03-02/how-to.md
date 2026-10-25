# How-To: Using the HeroUI Drawer, Admin Governance & Form Canvas in Phase 3 Studio

- **Task ID:** `TSK-03-02`
- **Application URL:** `http://localhost:3001/`

---

## 1. Navigating the HeroUI Component Drawer

1. Open Prototype 1 Studio at `http://localhost:3001/`.
2. Locate the left sidebar titled **Components** (HeroUI palette).
3. Browse the component groups:
   - **Form Controls:** `Input`, `Select`, `Autocomplete` *(Updated)*, `Calendar` *(Updated)*, `Checkbox` *(Updated)*, `CheckboxGroup` *(Updated)*.
   - **Layout:** `Card`, `Accordion`, `Divider`.
   - **Interactive:** `Button`, `Link`.
   - **Data Display:** `AvatarGroup` *(New)*, `Badge`, `Table`.
   - **Feedback & Navigation:** `Alert`, `Breadcrumbs`.
4. Use the search input at the top of the drawer to quickly filter by keyword (e.g. typing `"cal"` filters directly to `Calendar`).
5. Click on any category filter pill (e.g. `Form Controls`) to isolate controls for form construction.

---

## 2. Administrator Governance (Tier 1)

1. Click the **Admin Governance** button in the top toolbar (indicated by the green shield icon).
2. The modal **Administrator Component Governance** opens, listing all 15 system components and showing their permission status.
3. Toggle any component to **Restricted** (for example, restrict `Autocomplete` or `AvatarGroup`).
4. Click **Apply Governance Policy**.
5. Observe the HeroUI sidebar:
   - The restricted component now displays a dimmed background, an amber `Restricted` badge, and a lock icon.
   - Hovering or clicking the item displays a governance alert: builders cannot place this component onto the canvas or into forms.
6. Return to the modal and click **Allow All** to instantly restore full catalog availability.

---

## 3. Builder Flow: Dragging & Dropping into the Form Container (Tier 2)

1. On the center canvas, observe the **Employee Onboarding & Registration Form** container spanning 12 columns.
2. Select any allowed component from the HeroUI drawer (e.g. `Calendar` or `CheckboxGroup`):
   - **Option A (Drag & Drop):** Click and drag the component into the form container. The drop target will light up with a dashed blue border and animated glow. Release the mouse to drop.
   - **Option B (Click to Add):** Click directly on the component row or its `+` button in the drawer. The component is automatically appended as a child field within the form grid.
3. Observe that the new field appears immediately with its label, preview widget, column span indicator, and binding tag.
4. Click on the newly dropped field to select it. Its properties appear in the right Inspector panel.
5. In the **Props** tab, adjust the field label, placeholder, or required checkbox.
6. In the **Grid** tab, adjust the column span slider (from 1 to 12 columns).

---

## 4. Developer Flow: Data Binding & Mutation Mapping (Tier 3)

1. With a form field selected, switch to the **Binding (Phase 5)** tab in the right Inspector.
2. Configure the target API operation (e.g. `POST /api/employees` or `PUT /api/employees/:id`).
3. Set the `$-Rooted` RFC 9535 JSONPath (e.g. `$.data.employee.startDate`).
4. Review the **Outbound Mutation Payload Preview** showing real-time synthesized JSON.
5. Click **Test Upstream Mutation** to simulate schema validation and dry-run dispatch against the backend Platform API.

---

## 5. Moving & Reordering Elements in the Canvas

1. **Reordering Fields via Drag-and-Drop:**
   - Hover over any form field inside the **Employee Onboarding Form**.
   - Click and drag the vertical grip handle (`GripVertical`) on the left side of the field toolbar.
   - Drag over another field—a blue indicator line appears showing the drop position (before or after).
   - Release the mouse to instantly reorder the field in the layout.
2. **One-Click Directional Arrow Reordering:**
   - In each field header toolbar, use the **Move Earlier (Up)** (`ChevronUp`) or **Move Later (Down)** (`ChevronDown`) arrow buttons to shift elements sequentially across the grid.
3. **Reordering Canvas Sections:**
   - Each top-level canvas section (Page Header, Form Container, Employee Table) features section move controls in its top-right toolbar.
   - Click `Section: Up` or `Section: Down` to move the Form above the Header, or Table above the Form.
4. **Horizontal Position Nudging in Grid Inspector:**
   - Select any field and open the **Grid & Move** tab in the right Inspector.
   - Click `Nudge Left` or `Nudge Right` to shift the element's `colStart` across the 12-column grid.
   - Select quick width presets: `50% (6 Col)`, `100% (12 Col)`, or `33% (4 Col)`.

---

## 6. Interactive Preview Mode

1. In the top navigation bar, click the **Preview Page** button (or press `P`).
2. Observe the seamless transition into Preview Mode:
   - The left HeroUI drawer and right Inspector automatically collapse.
   - The 12-column guide lines, column numbers, component ID tags, selection outlines, and dashed drop boxes disappear completely.
   - A floating green banner appears: `Preview Mode: All studio guides, outlines, and editor chrome are hidden...`.
3. **Test Live Form Interactions:**
   - Type realistic input into the **Full Name** field.
   - Select a department from the dropdown menu.
   - Pick an employment date or toggle the VPN agreement checkbox.
   - Click **Save & Dispatch Record**.
   - A live **Form Submitted (Preview Simulation)** dialog appears displaying the synthesized RFC 9535 JSON payload!
4. **Exit Preview Mode:**
   - Click **Exit Preview** in the top bar or simply press the **Escape** key to return to Studio Design Mode with all panels intact.

