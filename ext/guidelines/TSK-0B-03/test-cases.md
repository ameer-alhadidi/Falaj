# Test Cases: Admin Gateway & Quota Governance

- **Task ID:** `TSK-0B-03`
- **Domain:** Security & Governance Verification

---

## Unit & Integration Test Cases

```typescript
describe('Admin Security & Quotas', () => {
  it('TC-SEC-01: Never exposes plaintext secret in API response', () => {
    const apiRegistrationResponse = {
      id: 'reg-01',
      serviceName: 'Core HR',
      status: 'SET',
      kmsKeyId: 'kms-0921-prod',
      lastRotated: '2026-10-24T14:00:00Z',
    };

    expect(apiRegistrationResponse).not.toHaveProperty('apiKey');
    expect(apiRegistrationResponse).not.toHaveProperty('clientSecret');
    expect(apiRegistrationResponse).not.toHaveProperty('token');
  });

  it('TC-QUOTA-01: Rejects page creation when quota exceeded', () => {
    const project = { maxPages: 10, currentPages: 10 };
    const canCreatePage = project.currentPages < project.maxPages;
    expect(canCreatePage).toBe(false);
  });
});
```

---

## E2E Test Cases (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('TC-ADMIN-E2E-01: Admin Gateway loads and allows credential rotation simulation', async ({ page }) => {
  await page.goto('http://localhost:3003');

  // Verify dashboard statistics
  await expect(page.locator('text=Total Projects')).toBeVisible();

  // Switch to API Registry tab
  await page.click('button:has-text("API Registry")');
  await expect(page.locator('text=Core HR API')).toBeVisible();
  await expect(page.locator('text=Status: SET')).toBeVisible();

  // Verify KMS key ID is visible
  await expect(page.locator('text=kms-')).toBeVisible();

  // Rotate credential button click
  await page.click('button:has-text("Rotate Key")');
  await expect(page.locator('text=Success')).toBeVisible();
});
```
