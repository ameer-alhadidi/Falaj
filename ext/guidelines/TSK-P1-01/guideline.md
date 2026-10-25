# Guideline: Rootless Podman & Socket Setup

- **Task ID:** `TSK-P1-01`
- **Phase:** Phase −1
- **Domain:** Infrastructure & Containerization

---

## Architectural Principles & Invariants

1. **Podman Only — Docker Disallowed:**
   - In accordance with Section 3.1 of the Master Prompt, Podman is the exclusive container runtime.
   - Never invoke `docker` or `docker compose`.
   - All compose stacks must run via `podman compose` (backed by `podman-compose`).

2. **Rootless Operation Invariants:**
   - Containers must run in rootless user namespaces (`rootless: true`).
   - Host port mappings must be strictly above port 1024 (e.g. 5432 for Postgres, 8080 for API, 8443 for Keycloak).
   - Volume mounts on SELinux systems require `:Z` (private unshared) or `:z` (shared).

3. **Fully Qualified Image Identifiers:**
   - Podman does not assume a default registry. All image references must include the full registry path:
     - `docker.io/library/postgres:18-alpine`
     - `quay.io/keycloak/keycloak:26.7.2`
     - `quay.io/podman/hello:latest`

4. **Testcontainers Socket & Ryuk Bypass:**
   - Under rootless Podman, Ryuk (the resource cleanup container) is prone to daemon instability.
   - Ryuk must be disabled: `TESTCONTAINERS_RYUK_DISABLED="true"`.
   - To prevent orphaned test containers, all test-spawned containers must carry the label `visual-platform.test=true`.
   - The project Makefile provides `make test-clean` to purge labeled resources after every test run.
