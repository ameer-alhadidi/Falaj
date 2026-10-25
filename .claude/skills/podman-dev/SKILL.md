---
name: podman-dev
description: Rootless Podman conventions, compose commands, Testcontainers socket setup, and volume permission handling.
---

# Podman Development Skill

Use this skill when defining containerfiles, configuring compose services, writing integration tests, and running local developer stacks.

## 1. Core Operating Constraints
- Podman Only: Never invoke `docker`. All compose files are run via `podman compose` backed by `podman-compose`.
- Rootless by Default: Ports must be mapped above 1024 on the host (e.g. 5432, 8080).
- Fully Qualified Image Names: Podman requires explicit registry prefixes:
  - `docker.io/library/postgres:17` (or `docker.io/library/postgres:18-alpine`)
  - `quay.io/keycloak/keycloak:26.7.2`
  - `docker.io/library/rust:1-bookworm`
  - `quay.io/podman/hello:latest`
- Inter-Container & Host Networking:
  - Container-to-host access uses `host.containers.internal` (never `host.docker.internal`).
  - Containers must be grouped into a named bridge network or pod defined in `compose.yaml`.
- Volume Relabeling:
  - On SELinux-enforced hosts, append `:Z` (private unshared) or `:z` (shared) to volume mounts.

## 2. Testcontainers & Socket Configuration

Integration tests (e.g. Rust tests using `testcontainers`) run against the rootless Podman socket.

### Environment Configuration:
```bash
# Linux / WSL2
export DOCKER_HOST="unix://${XDG_RUNTIME_DIR}/podman/podman.sock"
# Or Windows Named Pipe
# DOCKER_HOST="npipe:////./pipe/podman-machine-default"
export TESTCONTAINERS_RYUK_DISABLED="true"
```

### Container Labeling & Cleanup:
- Because Ryuk is disabled for rootless stability, all test containers must be labeled:
  `visual-platform.test=true`
- Provide `make test-clean` to purge all labeled resources:
  ```bash
  podman ps -a --filter "label=visual-platform.test=true" -q | xargs -r podman rm -f
  podman volume prune -f --filter "label=visual-platform.test=true"
  ```

## 3. Useful Developer Commands
- Run development stack: `podman compose up -d`
- Check service logs: `podman compose logs -f`
- Stop stack: `podman compose down`
- Inspect rootless info: `podman info`
