# Test Cases: Rootless Podman & Socket

- **Task ID:** `TSK-P1-01`
- **Domain:** Verification & Test Scenarios

---

## Test Scenario Matrix

| Test ID | Test Scenario | Execution Command | Expected Result | Pass Criteria |
| :--- | :--- | :--- | :--- | :--- |
| `TC-P1-01.1` | Engine Version Verification | `podman --version` | `podman version 6.0.2` | Major version $\ge 5.0.0$, exits with code 0 |
| `TC-P1-01.2` | Rootless Mode Assertion | `podman info --format "{{.Host.Security.Rootless}}"` | `true` | Value must be strictly `true` |
| `TC-P1-01.3` | Compose Specification Provider | `podman compose version` | `podman-compose version 1.6.0` | `podman-compose` responds, exits with code 0 |
| `TC-P1-01.4` | Container Lifecycle Smoke Test | `podman run --rm quay.io/podman/hello` | Hello Podman World ASCII banner | Container starts, executes, exits 0, and auto-removes |
| `TC-P1-01.5` | Host Named Pipe Reachability | `Test-Path \\.\pipe\podman-machine-default` | `True` | Named pipe exists in Windows object namespace |
| `TC-P1-01.6` | Residual Container Cleanliness | `podman ps -a --filter "label=visual-platform.test=true" -q` | `(empty)` | Zero leftover test containers after cleanup |
