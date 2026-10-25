# Examples: Architectural Decision Record (ADR-Lite)

- **Task ID:** `TSK-P1-05`
- **Domain:** Decision Logging

---

## 1. Concrete ADR Format

```markdown
### DEC-003: Podman Over Docker
- **Status:** Decided
- **Date:** 2026-10-25
- **Decision:** Use Podman 6.0.2 rootless exclusively for containerized local development and CI testing.
- **Rationale:** Meets strict security compliance for unprivileged container execution without root daemons.
- **Reversibility:** Medium (standard OCI Containerfiles used throughout).
```
