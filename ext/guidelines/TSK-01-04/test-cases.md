# Test Cases: Design Tokens & Hardcoded Color Lints

- **Task ID:** `TSK-01-04`
- **Domain:** Frontend Quality Verification

---

## Token Verification Tests

```powershell
# TC-TOK-01: Check for forbidden hardcoded hex colors in css files
$hexMatches = Select-String -Path "apps/**/*.css", "packages/**/*.css" -Pattern "#[0-9a-fA-F]{3,8}" -Exclude "tokens.css"
if ($hexMatches.Count -gt 0) {
  Write-Error "Found un-tokenized hex colors in application styles!"
}

# TC-TOK-02: Verify tokens build and export types cleanly
pnpm --filter @falaj/design-system typecheck
```
