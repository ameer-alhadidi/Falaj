# How-To: Running & Operating Prototype 1 (Desktop Studio)

- **Task ID:** `TSK-0B-01`
- **Port:** `3001`
- **Location:** `prototypes/prototype-1-studio/`

---

## Step-by-Step Developer Workflow

### Step 1: Launch the Prototype 1 Server
From the workspace root, run:
```powershell
pnpm --filter prototype-1-studio dev
# Or run production bundle:
# pnpm --filter prototype-1-studio start
```
Navigate in your browser to: `http://localhost:3001`.

### Step 2: Test Viewport Responsiveness
1. In the top toolbar, click **Tablet (768px)**.
2. Observe that the center canvas smoothly scales to a 768px bounded frame with drop shadows.
3. Click **Mobile (390px)** to inspect phone layout behavior.
4. Click **Desktop (12 Col)** to restore full-width workspace.

### Step 3: Test Dynamic Property Inspector
1. Click the **Employee Directory Table** component in the canvas.
2. In the right inspector panel, select the **Grid** tab.
3. Drag the **Column Span (1–12)** slider from 12 to 8.
4. Observe that the table in the canvas immediately updates its grid width in real time.
5. In the top toolbar, click **Undo** (or `Ctrl+Z`) to restore the 12-column span.

### Step 4: Test Arabic RTL Localization
1. Click the **LTR (English)** button in the top toolbar.
2. Observe that:
   - Document direction flips to `dir="rtl"`.
   - Typography transitions to **IBM Plex Sans Arabic**.
   - Sitemap tree moves to the right sidebar, and the inspector moves to the left.
   - Column 1 of the 12-column grid aligns to the visual right.
