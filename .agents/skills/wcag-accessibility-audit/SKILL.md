---
name: wcag-accessibility-audit
description: WCAG 2.2 AA accessibility verification standards, contrast formula checks, keyboard navigation for drag-and-drop, and axe-core Playwright recipes.
---

# WCAG Accessibility Audit Skill

Use this skill when auditing UI views, theme palettes, keyboard interactions, and automated accessibility test pipelines across the portal, prototypes, and published sites.

## 1. Compliance Standard: WCAG 2.2 AA

All platform interfaces must achieve zero automated violations against WCAG 2.2 AA standards:
- **Normal Text Contrast:** Minimum 4.5:1 ratio between text and its background.
- **Large Text Contrast:** Minimum 3.0:1 ratio for text ≥ 18pt (24px) or bold text ≥ 14pt (18.66px).
- **UI Components & Graphical Objects:** Minimum 3.0:1 ratio for input borders, focus indicators, and active selection boundaries.
- **Target Size (Minimum):** At least 24×24 CSS pixels for interactive targets (WCAG 2.2 Criterion 2.5.8), with 44×44 CSS pixels preferred for touch targets.

## 2. Palette Contrast Resolution (Enterprise Studio)

Audit suspect color pairs in `Enterprise Studio` theme tokens and enforce verified values:

| Mode | Suspect Pair | Raw Tokens | Ratio | Status / Resolution |
| :--- | :--- | :--- | :--- | :--- |
| **Dark** | Muted text on dark background | `#64748b` on `#090a0f` | ~3.8:1 | **FAIL** — Must be boosted to `#94a3b8` (achieves ~6.4:1). |
| **Dark** | White text on dark accent button | `#ffffff` on `#3b82f6` | ~3.9:1 | **FAIL** — Use dark text `#090a0f` on `#3b82f6` (achieves ~4.6:1), or darken accent to `#2563eb` for white text. |
| **Light** | Secondary text on light surface | `#475569` on `#ffffff` | ~7.2:1 | **PASS** |
| **Light** | White text on primary accent | `#ffffff` on `#2563eb` | ~4.6:1 | **PASS** |

## 3. Keyboard Navigation & Drag-and-Drop Sensor

The visual canvas and toolbox must never depend solely on mouse/pointer events:
1. **Toolbox Insertion:** Every component in the toolbox must be insertable via `Enter` or `Space` when focused, placing it into the currently selected container or at the end of the root canvas.
2. **Reordering via Keyboard (`@dnd-kit`):**
   - Implement `KeyboardSensor` with `sortableKeyboardCoordinates`.
   - `Space` or `Enter` lifts the component.
   - Arrow keys (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`) move the component across grid columns and rows.
   - `Space` or `Enter` drops the component; `Escape` cancels the move and returns to original position.
3. **Screen Reader Announcements:** Use ARIA live regions (`aria-live="assertive"` or `@dnd-kit/core` announcements) to announce:
   - "Picked up component [Type] at Column [X], Row [Y]"
   - "Moved to Column [X], Row [Y]"
   - "Dropped component [Type] at Column [X], Row [Y]"

## 4. Automated Auditing with Playwright & Axe-Core

Every prototype and portal view must be validated in CI with `@axe-core/playwright`:

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('portal view achieves WCAG 2.2 AA compliance', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## 5. Focus Visibility & Motion Reduction
- **Focus Rings:** Never use `outline: none` without a visible replacement. All focusable elements must display a distinct focus ring: `outline: 2px solid var(--portal-border-active); outline-offset: 2px;`.
- **Reduced Motion:** Respect user system preferences:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
