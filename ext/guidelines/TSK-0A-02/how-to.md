# How-To: Executing WCAG Audits and SSRF Validations

- **Task ID:** `TSK-0A-02`
- **Domain:** Audit Workflows

---

## 1. Running Axe-Core Accessibility Audits

```powershell
# Run Playwright accessibility specs
pnpm dlx playwright test tests/accessibility.spec.ts
```

In the test suite:
```typescript
import AxeBuilder from '@axe-core/playwright';

const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
  .analyze();

expect(results.violations).toEqual([]);
```

---

## 2. Verifying Disallowed RFC 9535 Queries

When testing the binding engine:
1. Input disallowed strings (`$..item`, `$[?(@.price > 10)]`, `$[0:5]`).
2. Verify the parser raises an explicit diagnostic error and refuses evaluation.
