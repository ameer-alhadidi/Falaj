# Guideline: Rootless Podman Compose Stack

- **Task ID:** `TSK-01-05`
- **Phase:** Phase 1
- **Domain:** Containers & Local Infrastructure

---

## Architectural Principles & Invariants

1. **Rootless by Default:**
   - Exclusively use Podman 6.0.2 in rootless mode.
   - Host port mappings must strictly exceed 1024 (e.g. 5432 for Postgres, 8080 for API, 8443 for Keycloak).
   - Docker daemon commands (`docker`, `docker compose`) are strictly prohibited.

2. **Registry Disambiguation:**
   - Always specify fully qualified image names (e.g. `docker.io/library/postgres:18-alpine`, `quay.io/keycloak/keycloak:26.7.2`).
   - Do not rely on short image aliases.

3. **SELinux Volume Relabeling:**
   - Volume mounts must use `:Z` flag (e.g. `- postgres_data:/var/lib/postgresql/data:Z`) to ensure correct unprivileged container file permissions.
