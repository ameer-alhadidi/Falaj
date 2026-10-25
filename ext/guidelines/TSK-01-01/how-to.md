# How-To: Managing Monorepo Workspaces

- **Task ID:** `TSK-01-01`
- **Domain:** Developer Workflows

---

## 1. Bootstrapping Dependencies

```powershell
# Install Node workspace dependencies
pnpm install

# Check Cargo workspace members
cargo check --workspace
```

---

## 2. Adding a New Workspace Package

1. Create directory under `packages/<package-name>`.
2. Add `package.json` with `"name": "@falaj/<package-name>"`.
3. In consumer app, add `"dependencies": { "@falaj/<package-name>": "workspace:*" }`.
4. Run `pnpm install` to link packages.
