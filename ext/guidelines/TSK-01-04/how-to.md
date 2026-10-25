# How-To: Packaging and Publishing Design System

- **Task ID:** `TSK-01-04`
- **Domain:** Frontend Workflows

---

## 1. Building the Design System Package

```powershell
pnpm --filter @falaj/design-system build
```

---

## 2. Linking in a New Workspace Application

In `apps/<app-name>/package.json`:
```json
{
  "dependencies": {
    "@falaj/design-system": "workspace:*"
  }
}
```
Run `pnpm install` from the repository root.
