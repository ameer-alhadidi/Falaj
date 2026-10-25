# Test Cases: Podman Rootless Environment

- **Task ID:** `TSK-01-05`
- **Domain:** Container Verification

---

## Container Environment Test Suite

```powershell
# TC-POD-01: Verify Rootless Execution
$rootless = podman info --format "{{.Host.Security.Rootless}}"
if ($rootless -ne "true") {
  Write-Error "Podman is not running in rootless mode!"
}

# TC-POD-02: Port Range Check
# Ensure no exposed host ports <= 1024 exist in compose.yaml
$privilegedPorts = Select-String -Path "compose.yaml" -Pattern '"([1-9][0-9]{0,2}|102[0-4]):'
if ($privilegedPorts.Count -gt 0) {
  Write-Error "Privileged port (<= 1024) detected in compose.yaml!"
}
```
