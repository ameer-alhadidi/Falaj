# Test Cases: Multi-Theme & RTL Verification

- **Task ID:** `TSK-0B-04`
- **Domain:** Visual & Directionality Conformance

---

## Visual Regression Test Cases

```typescript
import { test, expect } from '@playwright/test';

describe('Bidirectional Layout & Theme Conformance', () => {
  test('TC-VIS-01: Direction toggle flips document dir attribute', async ({ page }) => {
    await page.goto('http://localhost:3001');
    const toggle = page.locator('button:has-text("LTR / RTL")');
    await toggle.click();
    const dir = await page.evaluate(() => document.documentElement.getAttribute('dir'));
    expect(dir).toBe('rtl');
  });

  test('TC-VIS-02: Dark/Light toggle switches theme attribute', async ({ page }) => {
    await page.goto('http://localhost:3001');
    const themeBtn = page.locator('button:has-text("Theme")');
    await themeBtn.click();
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('light');
  });

  test('TC-VIS-03: No horizontal scroll overflow in RTL mode', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl'));
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // 2px margin tolerance
  });
});
```
