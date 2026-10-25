# How-To: Managing Page Schemas and Concurrency

- **Task ID:** `TSK-0A-01`
- **Domain:** Data Workflows

---

## 1. Concurrency Check Workflow

When saving a page from the Visual Studio:
1. Studio client sends `pageId`, `expectedVersion`, and serialized `astRoot`.
2. Backend starts a SQL transaction.
3. Fetch `MAX(version_number)` for the given `page_id`.
4. If `current != expectedVersion`:
   - Abort transaction.
   - Return `HTTP 409 Conflict` with the current server version number and diff summary.
5. If match:
   - Insert new row into `page_versions` with `version_number = current + 1`.
   - Update `pages.current_version_id`.
   - Commit transaction and return `200 OK` with `newVersion`.
