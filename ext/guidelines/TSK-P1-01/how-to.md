# How-To: Setting Up & Operating Rootless Podman

- **Task ID:** `TSK-P1-01`
- **Domain:** Developer Workflow

---

## Step-by-Step Execution Guide

### Step 1: Initialize and Start the Podman Machine
On Windows, verify that the WSL2-backed Podman machine is active:
```powershell
podman machine list
# If not running:
# podman machine start podman-machine-default
```

### Step 2: Confirm Rootless Execution Mode
Run `podman info` and verify that the engine is operating in rootless user namespaces:
```powershell
podman info --format "{{.Host.Security.Rootless}}"
# Expected output: true
```

### Step 3: Verify Named Pipe / Socket Availability
Verify that the Windows host named pipe is reachable for Testcontainers and external clients:
```powershell
Get-ChildItem \\.\pipe\ | Where-Object { $_.Name -like "*podman*" }
# Expected output: podman-machine-default
```

### Step 4: Run the Local Services
Launch the developer container stack using `podman compose`:
```powershell
podman compose up -d
podman compose ps
```

### Step 5: Clean Up Test Artifacts
Purge all test-spawned containers and volumes:
```powershell
podman ps -a --filter "label=visual-platform.test=true" -q | ForEach-Object { podman rm -f $_ }
podman volume prune -f --filter "label=visual-platform.test=true"
```
