# How-To: Managing Podman Compose Services

- **Task ID:** `TSK-01-05`
- **Domain:** Local Infrastructure Workflows

---

## 1. Starting the Compose Stack

```powershell
# Start services in detached mode
podman-compose up -d

# Check running services
podman ps
```

---

## 2. Stopping and Resetting Database

```powershell
# Stop services
podman-compose down

# Reset database volume
podman volume rm platform_postgres_data
```
