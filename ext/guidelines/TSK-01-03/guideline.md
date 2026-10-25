# Guideline: PostgreSQL Migrations & Repository Layer

- **Task ID:** `TSK-01-03`
- **Phase:** Phase 1
- **Domain:** Database Architecture & SQLx

---

## Architectural Principles & Invariants

1. **Strict Versioned Migrations:**
   - All database DDL changes must be maintained as versioned SQL files under `database/migrations/`.
   - Never apply manual DDL changes directly to development, staging, or production databases.

2. **Compile-Time SQL Verification:**
   - Use `sqlx::query!` and `sqlx::query_as!` to guarantee query syntax and column type correctness at compile time.
   - Maintain `sqlx-data.json` for offline builds in CI without requiring a live database container.

3. **Connection Pooling Invariants:**
   - Use `sqlx::postgres::PgPoolOptions` with bounded pool sizes (minimum 5, maximum 20 connections per pod).
   - Set idle timeouts and query timeouts to prevent connection exhaustion.
