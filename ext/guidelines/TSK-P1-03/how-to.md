# How-To: Executing Context7 Documentation Queries

- **Task ID:** `TSK-P1-03`
- **Domain:** Documentation Workflows

---

## 1. When to Use Context7

Trigger Context7 when:
- Designing new routing or extractor logic in Axum (`/tokio-rs/axum`).
- Checking the exact signature of SQLx transaction handlers (`/launchbadge/sqlx`).
- Validating Next.js 15+ App Router Server Actions or caching headers (`/vercel/next.js`).

---

## 2. Best Practices

- Provide specific queries (e.g. "State extractor with Arc<AppState>" rather than just "state").
- Cross-reference retrieved signatures with the project's pinned `Cargo.toml` or `package.json` versions.
