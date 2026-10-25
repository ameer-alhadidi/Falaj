# Examples: Rootless `compose.yaml` Specification

- **Task ID:** `TSK-01-05`
- **Domain:** Infrastructure Specification

---

## 1. Local Development Compose Stack (`compose.yaml`)

```yaml
version: '3.8'

services:
  postgres:
    image: docker.io/library/postgres:18-alpine
    container_name: platform-postgres
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
    command: start-dev --http-port 8081
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: adminpassword
    ports:
      - "8081:8081"
    depends_on:
      - postgres
    networks:
      - platform_net

networks:
  platform_net:
    driver: bridge

volumes:
  postgres_data:
```
