# How-To: Running and Developing Platform API

- **Task ID:** `TSK-01-02`
- **Domain:** Backend Development Workflows

---

## 1. Running the API Service Locally

```powershell
# Run with live auto-reload via cargo-watch
cargo watch -x "run -p platform-api"
```

---

## 2. Testing Endpoints

```powershell
# Health check query
curl http://localhost:8080/health
```
Expected response:
```json
{"status":"healthy","service":"platform-api"}
```
