# How-To: Running Migrations and Preparing Offline Queries

- **Task ID:** `TSK-01-03`
- **Domain:** Database Workflows

---

## 1. Running Migrations

```powershell
# Set database connection string
$env:DATABASE_URL="postgres://postgres:devpassword@localhost:5432/platform_dev"

# Apply all pending migrations
sqlx migrate run --source database/migrations
```

---

## 2. Generating Offline Query Metadata (`sqlx-data.json`)

To enable CI builds without requiring a live database:

```powershell
cargo sqlx prepare --workspace
```
Commit the updated `sqlx-data.json` to source control.
