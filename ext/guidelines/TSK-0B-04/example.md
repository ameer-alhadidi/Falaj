# Examples: Automated Visual Harness Scripts

- **Task ID:** `TSK-0B-04`
- **Domain:** Automated Visual Testing

---

## 1. Playwright Multi-Theme Snapshot Script

```typescript
import { test } from '@playwright/test';

const PROTOTYPES = [
  { name: 'studio', port: 3001 },
  { name: 'matrix', port: 3002 },
  { name: 'admin', port: 3003 },
];

for (const proto of PROTOTYPES) {
  test(`Capture visual snapshots for ${proto.name}`, async ({ page }) => {
    // 1. Desktop Dark
    await page.setViewportSize({ width: 1536, height: 826 });
    await page.goto(`http://localhost:${proto.port}`);
    await page.screenshot({ path: `screenshots/${proto.name}-desktop-dark.png` });

    // 2. Light Mode Toggle
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.screenshot({ path: `screenshots/${proto.name}-desktop-light.png` });

    // 3. Tablet Viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: `screenshots/${proto.name}-tablet-light.png` });

    // 4. RTL Arabic Mode
    await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl'));
    await page.screenshot({ path: `screenshots/${proto.name}-tablet-rtl.png` });
  });
}
```
