# Test Cases: Skill Parity & Integrity Verification

- **Task ID:** `TSK-P1-04`
- **Domain:** Integrity Checks

---

## Skill Verification Tests

```powershell
# TC-SKILL-01: Verify all 7 skills exist in .claude/skills
$skills = @(
  "enterprise-studio-tokens",
  "page-schema",
  "security-review",
  "phase-report",
  "podman-dev",
  "arabic-rtl-engineering",
  "wcag-accessibility-audit"
)

foreach ($s in $skills) {
  Test-Path ".claude/skills/$s/SKILL.md"
  Test-Path ".agents/skills/$s/SKILL.md"
}

# TC-SKILL-02: Verify identical file contents (diff check)
foreach ($s in $skills) {
  $f1 = Get-FileHash ".claude/skills/$s/SKILL.md"
  $f2 = Get-FileHash ".agents/skills/$s/SKILL.md"
  if ($f1.Hash -ne $f2.Hash) {
    Write-Error "Mismatch in skill $s"
  }
}
```
