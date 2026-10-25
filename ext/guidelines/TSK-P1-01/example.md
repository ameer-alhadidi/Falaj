# Examples: Rootless Podman Configuration

- **Task ID:** `TSK-P1-01`
- **Domain:** Infrastructure & Compose Specs

---

## 1. Local Compose Specification (`compose.yaml` snippet)

```yaml
version: '3.8'

services:
  postgres:
    image: docker.io/library/postgres:18-alpine
    container_name: platform-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: platform_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: devpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data:Z
    networks:
      - platform_net

  keycloak:
    image: quay.io/keycloak/keycloak:26.7.2
    container_name: platform-keycloak
    command: start-dev --http-port=8080
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: adminpassword
    ports:
      - "8443:8080"
    networks:
      - platform_net

networks:
  platform_net:
    driver: bridge

volumes:
  postgres_data:
```

---

## 2. Testcontainers Environment File (`.env.test`)

```bash
# Windows Host Configuration
DOCKER_HOST="npipe:////./pipe/podman-machine-default"
TESTCONTAINERS_RYUK_DISABLED="true"

# Linux / WSL2 Configuration
# DOCKER_HOST="unix:///run/user/1000/podman/podman.sock"
# TESTCONTAINERS_RYUK_DISABLED="true"
```
