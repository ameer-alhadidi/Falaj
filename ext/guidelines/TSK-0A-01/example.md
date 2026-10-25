# Examples: Page Schema AST & SQL Migration

- **Task ID:** `TSK-0A-01`
- **Domain:** Data Modeling

---

## 1. Canonical CanvasComponentNode Schema (JSON)

```json
{
  "id": "node-btn-submit",
  "componentType": "Button",
  "version": 1,
  "layout": {
    "colStart": 1,
    "colSpan": 3,
    "rowStart": 4,
    "rowSpan": 1
  },
  "props": {
    "label": "Submit Request",
    "variant": "primary",
    "disabled": false
  },
  "bindings": {},
  "events": {
    "onClick": {
      "action": "triggerApi",
      "targetOperation": "submit-request"
    }
  },
  "responsive": {
    "mobile": {
      "colSpan": 12
    }
  }
}
```

---

## 2. PostgreSQL DDL: Page Versions Table

```sql
CREATE TABLE page_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    version_number BIGINT NOT NULL,
    ast_root JSONB NOT NULL,
    commit_message TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_page_version UNIQUE (page_id, version_number)
);
```
