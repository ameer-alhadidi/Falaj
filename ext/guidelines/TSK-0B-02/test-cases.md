# Test Cases: RFC 9535 Binding Evaluator & Validator

- **Task ID:** `TSK-0B-02`
- **Domain:** Verification & Conformance

---

## Unit Test Cases (Jest / Vitest)

```typescript
import { validateBindingPath } from './validator';
import { evaluateItemExpression } from './evaluator';

describe('RFC 9535 Binding Subset Validator', () => {
  it('TC-BIND-01: Accepts valid root collection path', () => {
    expect(validateBindingPath('$.data.items').valid).toBe(true);
    expect(validateBindingPath('$.total_count').valid).toBe(true);
  });

  it('TC-BIND-02: Accepts valid item-relative path', () => {
    expect(validateBindingPath('@.department.name').valid).toBe(true);
    expect(validateBindingPath('@.email').valid).toBe(true);
  });

  it('TC-BIND-03: Rejects filter expressions with ?()', () => {
    const res = validateBindingPath('$.items[?(@.active == true)]');
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/Filter expressions/i);
  });

  it('TC-BIND-04: Rejects recursive descent ..', () => {
    const res = validateBindingPath('$..name');
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/Recursive descent/i);
  });

  it('TC-BIND-05: Rejects negative array indices', () => {
    const res = validateBindingPath('$.items[-1]');
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/Negative array indices/i);
  });
});

describe('RFC 9535 Item Evaluator', () => {
  const sampleItem = {
    id: 101,
    name: 'Sarah Connor',
    department: {
      id: 'D01',
      name: 'Engineering',
    },
  };

  it('TC-EVAL-01: Resolves direct scalar property', () => {
    expect(evaluateItemExpression('@.name', sampleItem)).toBe('Sarah Connor');
  });

  it('TC-EVAL-02: Resolves nested property path', () => {
    expect(evaluateItemExpression('@.department.name', sampleItem)).toBe('Engineering');
  });

  it('TC-EVAL-03: Returns null gracefully for missing nested property without throwing', () => {
    expect(evaluateItemExpression('@.location.city', sampleItem)).toBeNull();
  });
});
```

---

## E2E Test Cases (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('TC-E2E-01: Live binding matrix displays evaluated rows in prototype 2', async ({ page }) => {
  await page.goto('http://localhost:3002');
  
  // Verify table contains resolved department
  const cell = page.locator('text=Engineering').first();
  await expect(cell).toBeVisible();

  // Test state simulation toggle to Error
  await page.click('button:has-text("502 Error")');
  await expect(page.locator('text=502 Bad Gateway')).toBeVisible();

  // Restore Default
  await page.click('button:has-text("Default")');
  await expect(cell).toBeVisible();
});
```
