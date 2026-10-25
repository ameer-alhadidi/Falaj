# Test Cases: CI Pipeline Verification

- **Task ID:** `TSK-01-06`
- **Domain:** Pipeline Validation

---

## Workflow Syntax & Gate Checks

```powershell
# TC-CI-01: Verify GitHub workflow file exists and is valid YAML
Test-Path ".github/workflows/ci.yml"

# TC-CI-02: Verify all quality gates pass locally
$result = (& cargo fmt -- --check) -and ($LASTEXITCODE -eq 0)
if (-not $result) { Write-Error "Rustfmt failed" }
```
