# How-To: Executing Multi-Theme & RTL Visual Tests

- **Task ID:** `TSK-0B-04`
- **Domain:** Visual Regression Execution

---

## 1. Prerequisites

Ensure all three prototype servers are running:
```powershell
pnpm --filter prototype-1-studio dev   # Port 3001
pnpm --filter prototype-2-data-mapping dev # Port 3002
pnpm --filter prototype-3-admin dev        # Port 3003
```

---

## 2. Running Playwright Test Suite

```powershell
pnpm dlx playwright test tests/visual-harness.spec.ts
```

---

## 3. Reviewing Generated Snapshots

Inspect snapshots saved in `screenshots/` or the conversation artifact directory:
1. Verify that dark mode uses `#090a0f` background and `#f8fafc` text.
2. Verify that light mode uses `#f8fafc` background and `#0f172a` text.
3. Verify that table columns, sidebars, and inputs mirror cleanly in RTL.
