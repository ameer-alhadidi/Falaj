# Platform Engineering How-To Guide & Cookbook
## Guidelines, Concrete Examples, and Automated Test Recipes

- **Location:** `ext/how-to-guide.md`
- **Companion Kanban:** [`ext/kanban.md`](file:///d:/work/Falaj/ext/kanban.md)
- **Last Updated:** 2026-10-25

---

## Table of Contents

1. [HT-P1-01: Podman Rootless Stack Execution](#ht-p1-01-podman-rootless-stack-execution)
2. [HT-P1-02: Running CLI Toolchain Audits](#ht-p1-02-running-cli-toolchain-audits)
3. [HT-P1-03: MCP Smoke Testing & Live Doc Queries](#ht-p1-03-mcp-smoke-testing--live-doc-queries)
4. [HT-P1-04: Authoring and Mirroring Agent Skills](#ht-p1-04-authoring-and-mirroring-agent-skills)
5. [HT-P1-05: Recording Architectural Decisions](#ht-p1-05-recording-architectural-decisions)
6. [HT-0A-01: Page Schema & Database Modelling](#ht-0a-01-page-schema--database-modelling)
7. [HT-0A-02: WCAG 2.2 Contrast Audit & RFC 9535 Path Evaluation](#ht-0a-02-wcag-22-contrast-audit--rfc-9535-path-evaluation)
8. [Upcoming Features Preview (Phase 0B & Phase 1)](#upcoming-features-preview-phase-0b--phase-1)

---

## HT-P1-01: Podman Rootless Stack Execution

- **Kanban Task:** `TSK-P1-01`
- **Category:** Infrastructure & Containers

### Guidelines
1. **Never use Docker:** Always invoke `podman` or `podman compose`.
2. **Rootless Ports:** Expose host ports strictly above 1024 (e.g. 5432, 8080, 8443).
3. **Fully Qualified Image Identifiers:** Podman does not assume a default registry. Always supply explicit registries (e.g., `docker.io/library/postgres:18-alpine`, `quay.io/keycloak/keycloak:26.7.2`).
4. **Testcontainers Socket Binding:** Ryuk must be disabled (`TESTCONTAINERS_RYUK_DISABLED="true"`) to prevent daemon crashes under rootless environments. All test-spawned containers must be tagged with `visual-platform.test=true`.

### Concrete Examples

#### Podman Compose Service (`compose.yaml` snippet)
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

networks:
  platform_net:
    driver: bridge

volumes:
  postgres_data:
```

### Verification & Test Commands
```powershell
# 1. Verify rootless status
podman info --format "{{.Host.Security.Rootless}}"

# 2. Run hello-world smoke test
podman run --rm quay.io/podman/hello

# 3. Clean all test containers spawned by integration tests
podman ps -a --filter "label=visual-platform.test=true" -q | ForEach-Object { podman rm -f $_ }
```

---

## HT-P1-02: Running CLI Toolchain Audits

- **Kanban Task:** `TSK-P1-02`
- **Category:** Toolchain & Quality Gates

### Guidelines
- All production code must pass formatting, strict lints, security audits, and dependency license checks with **zero warnings**.
- Never commit with `--no-verify`.

### Concrete Commands & Test Recipes

```powershell
# 1. Format checks (Rust & TypeScript)
cargo fmt -- --check
pnpm prettier --check "**/*.{ts,tsx,json,css,md}"

# 2. Linting (Zero Warnings Permitted)
cargo clippy --all-targets --all-features -- -D warnings
pnpm eslint . --max-warnings 0

# 3. Security & Dependency Auditing
cargo audit
cargo deny check advisories bans licenses sources

# 4. Nextest Fast Test Execution
cargo nextest run --all-features

# 5. Playwright E2E Tests
pnpm dlx playwright test
```

---

## HT-P1-03: MCP Smoke Testing & Live Doc Queries

- **Kanban Task:** `TSK-P1-03`
- **Category:** Agent Capabilities & Tooling

### Guidelines
- Always resolve library identifiers before querying Context7 to obtain authoritative documentation.
- Never write API integrations from memory; query live docs for Axum, Tokio, SQLx, Next.js, and shadcn/ui.

### Concrete Example (Context7 API Query)
```json
{
  "ServerName": "context7",
  "ToolName": "resolve-library-id",
  "Arguments": {
    "libraryName": "axum",
    "query": "Router state and extractor middleware"
  }
}
```
*Resolved identifier: `/tokio-rs/axum` (v0.8.4).*

---

## HT-P1-04: Authoring and Mirroring Agent Skills

- **Kanban Task:** `TSK-P1-04`
- **Category:** Customization & Project Standards

### Guidelines
- Project skills live canonically in `.claude/skills/<skill-name>/SKILL.md`.
- Skills must be mirrored in `.agents/skills/<skill-name>/SKILL.md` to ensure instant discovery by Antigravity IDE and subagents.
- Every `SKILL.md` must include YAML frontmatter with `name` and `description`.

### Directory Structure Example
```text
visual-platform/
├── .claude/
│   └── skills/
│       ├── enterprise-studio-tokens/
│       │   └── SKILL.md
│       └── page-schema/
│           └── SKILL.md
└── .agents/
    └── skills/ (Mirrored copy)
```

---

## HT-P1-05: Recording Architectural Decisions

- **Kanban Task:** `TSK-P1-05`
- **Category:** Architecture Governance

### Guidelines
- Every non-trivial architectural, library, or security choice must be recorded in [`docs/outstanding-decisions.md`](file:///d:/work/Falaj/docs/outstanding-decisions.md).
- Follow the ADR-lite format:
  - **Status:** Proposed / Decided / Superseded
  - **Date:** YYYY-MM-DD
  - **Decision:** Clear active-voice statement.
  - **Rationale:** Why this option was chosen over alternatives.
  - **Reversibility:** High / Medium / Low.

---

## HT-0A-01: Page Schema & Database Modelling

- **Kanban Task:** `TSK-0A-01`
- **Category:** Data Modeling & Schemas

### Guidelines
- Page nodes are modeled as `CanvasComponentNode` JSON ASTs. No executable JavaScript is allowed.
- Page versions use a monotonically increasing integer (`version_number BIGINT`) to enforce optimistic concurrency locking.
- Database tables use UUID primary keys (`gen_random_uuid()`) with explicit foreign key cascading constraints.

### Concrete Example: Optimistic Save Handler (Rust Axum)
```rust
use axum::{extract::{State, Path}, Json, http::StatusCode};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

#[derive(Deserialize)]
pub struct SavePageRequest {
    pub expected_version: i64,
    pub ast_root: serde_json::Value,
    pub commit_message: Option<String>,
}

#[derive(Serialize)]
pub struct SavePageResponse {
    pub new_version: i64,
}

pub async fn save_page_version(
    State(pool): State<PgPool>,
    Path(page_id): Path<uuid::Uuid>,
    Json(payload): Json<SavePageRequest>,
) -> Result<Json<SavePageResponse>, (StatusCode, String)> {
    let mut tx = pool.begin().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    // 1. Fetch current version for optimistic lock check
    let current_version: Option<i64> = sqlx::query_scalar!(
        "SELECT MAX(version_number) FROM page_versions WHERE page_id = $1",
        page_id
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let current = current_version.unwrap_or(0);
    if current != payload.expected_version {
        return Err((
            StatusCode::CONFLICT,
            format!("Stale save rejected. Current version is {}, expected {}", current, payload.expected_version),
        ));
    }

    let next_version = current + 1;

    // 2. Insert new immutable version
    sqlx::query!(
        r#"
        INSERT INTO page_versions (page_id, version_number, ast_root, commit_message, created_by)
        VALUES ($1, $2, $3, $4, '00000000-0000-0000-0000-000000000000')
        "#,
        page_id,
        next_version,
        payload.ast_root,
        payload.commit_message
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    tx.commit().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(SavePageResponse { new_version: next_version }))
}
```

---

## HT-0A-02: WCAG 2.2 Contrast Audit & RFC 9535 Path Evaluation

- **Kanban Task:** `TSK-0A-02`
- **Category:** Accessibility & Expression Evaluation

### Guidelines
- **WCAG 2.2 AA Contrast Formula:**
  $$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$
  where $L_1$ is the relative luminance of the lighter color and $L_2$ is the relative luminance of the darker color.
- Body text requires $\ge 4.5:1$. Large text and UI component boundaries require $\ge 3.0:1$.
- **RFC 9535 Binding Path Rules:**
  - `$` accesses the API response root (e.g. `$.data`, `$.total`).
  - `@` accesses the current collection item inside a repeater template (e.g. `@.department.name`).

### Concrete Example: Path Evaluator Function (TypeScript)
```typescript
export function evaluateItemPath(path: string, item: any): any {
  if (!path.startsWith('@.')) {
    throw new Error(`Invalid item path: ${path}. Must start with '@.'`);
  }

  const segments = path.slice(2).split('.');
  let current = item;

  for (const segment of segments) {
    if (current == null) return null;
    current = current[segment];
  }

  return current ?? null;
}
```

### Automated Accessibility Test Recipe (Playwright + Axe-Core)
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('verify WCAG 2.2 AA compliance on canvas studio', async ({ page }) => {
  await page.goto('http://localhost:3000/#canvas');
  await page.waitForSelector('[data-canvas-root]');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

---

## HT-0B-01: Desktop Studio Canvas & 12-Column Grid Architecture

- **Kanban Task:** `TSK-0B-01`
- **Category:** Visual Canvas & State Architecture
- **Location:** `prototypes/prototype-1-studio/`

### Guidelines
1. **Normalized Grid Properties Only:** Never store raw CSS strings in page schemas. Always store normalized integer coordinates: `colStart` (1–12), `colSpan` (1–12), `rowStart`, `rowSpan`.
2. **Command-Based History:** Maintain immutable undo/redo stacks (`undoStack`, `redoStack`) storing AST deep clones. Never mutate node trees in-place.
3. **Responsive Inheritance:** The `desktop` breakpoint serves as the base layout. `tablet` and `mobile` layouts override specific attributes (`colSpan`, `visible`) via the `responsive` record.
4. **Stable Component IDs:** Node IDs (`#node-employee-table`) must remain permanent across reorders, updates, and layout changes.

### Concrete Example: Undo/Redo & Property Update Pattern
```typescript
const updateNodeProperty = (nodeId: string, propKey: string, propValue: any) => {
  // 1. Push previous state clone to undo stack and clear redo stack
  setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(pageNodes))]);
  setRedoStack([]);
  setSaveStatus('Unsaved changes');

  // 2. Pure recursive tree update preserving stable node IDs
  const updateTree = (nodes: CanvasComponentNode[]): CanvasComponentNode[] => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, props: { ...node.props, [propKey]: propValue } };
      }
      if (node.children) {
        return { ...node, children: updateTree(node.children) };
      }
      return node;
    });
  };

  setPageNodes(updateTree(pageNodes));
};
```

### Verification & Test Recipe
```powershell
# 1. Run Prototype 1 dev server
pnpm --filter prototype-1-studio dev

# 2. Verify build succeeds with zero TypeScript errors
pnpm --filter prototype-1-studio build
```

---

## HT-0B-02: Visual Data-Binding Matrix & RFC 9535 Syntax Validator

- **Kanban Task:** `TSK-0B-02`
- **Category:** Data Binding & Grammar Validation
- **Location:** `prototypes/prototype-2-data-mapping/`

### Guidelines
1. **Prefix Invariants:**
   - Collection & root paths must start with `$.` (e.g. `$.data`, `$.total`).
   - Field mappings inside templates must start with `@.` (e.g. `@.department.name`).
2. **Strict Disallowed Selectors:** Filter expressions `?()`, recursive descent `..`, regex `match()`, and negative indices `[-]` must be rejected at input time.
3. **Simulated State Testing:** Every data-bound component must provide explicit UI states for: `default`, `loading`, `empty`, and `error`.

### Concrete Example: Client-Side RFC 9535 Grammar Validator
```typescript
export function validateBindingPath(path: string): { valid: boolean; error?: string } {
  if (!path.startsWith('$.') && !path.startsWith('@.')) {
    return { valid: false, error: "Path must start with '$' (root) or '@' (item relative)." };
  }
  if (path.includes('?(')) {
    return { valid: false, error: "Disallowed: Filter expressions '?()' are prohibited in RFC 9535 binding subset." };
  }
  if (path.includes('..')) {
    return { valid: false, error: "Disallowed: Recursive descent '..' is prohibited to prevent ReDoS." };
  }
  if (/\[-\d+\]/.test(path)) {
    return { valid: false, error: "Disallowed: Negative array indices are not supported." };
  }
  return { valid: true };
}
```

### Verification & Test Recipe
```powershell
# Run Prototype 2 dev server on port 3002
pnpm --filter prototype-2-data-mapping dev
```

---

## HT-0B-03: Admin Gateway & Write-Only Credential Vault

- **Kanban Task:** `TSK-0B-03`
- **Category:** Governance & Secret Management
- **Location:** `prototypes/prototype-3-admin/`

### Guidelines
1. **Write-Only Secrets in UI:** The frontend must NEVER receive or display raw API tokens, client secrets, or credentials. Only display: `Status: SET`, `KMS Key ID`, and `Last Rotated Date`.
2. **Quota Boundaries:** Every project enforces hard limits on `maxPages`, `maxComponentsPerPage`, and `rateLimitRpm` configured in `project_restrictions`.
3. **Dual Identity Segregation:** Builder identities (Platform Studio admins/developers) and Site-Visitor identities (published site consumers) must never share session cookies or tokens.

### Concrete Example: Write-Only Vault Component (React)
```tsx
interface CredentialVaultProps {
  apiName: string;
  status: 'SET' | 'NOT_SET';
  keyId: string;
  lastRotated: string;
  onRotateKey: () => void;
}

export function CredentialVaultCard({ apiName, status, keyId, lastRotated, onRotateKey }: CredentialVaultProps) {
  return (
    <div className="vault-card" style={{ background: 'var(--portal-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>CREDENTIAL VAULT (WRITE-ONLY)</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
        <div>
          <span style={{ fontWeight: 600, color: status === 'SET' ? 'var(--portal-success)' : 'var(--portal-error)' }}>
            Status: {status}
          </span>
          <span style={{ margin: '0 8px', color: 'var(--portal-text-muted)' }}>&bull;</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>KMS: {keyId}</span>
        </div>
        <button onClick={onRotateKey} className="btn-rotate" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
          Rotate Key
        </button>
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--portal-text-muted)', marginTop: '4px' }}>
        Last Rotated: {new Date(lastRotated).toLocaleString()}
      </div>
    </div>
  );
}
```

---

## HT-0B-04: Multi-Theme & RTL Automated Screenshot Harness

- **Kanban Task:** `TSK-0B-04`
- **Category:** Automated Testing & Visual Regression

### Guidelines
1. Capture screenshots in both **Desktop (1536×826)** and **Tablet (768×1024)** viewports.
2. Verify visual appearance across **Light Mode** and **Dark Mode**.
3. Verify that **RTL Arabic** layout mirrors correctly without horizontal text overflow or flipped icons.

### Automated Playwright Recipe
```typescript
import { test } from '@playwright/test';

const PROTOTYPES = [
  { name: 'studio', port: 3001 },
  { name: 'matrix', port: 3002 },
  { name: 'admin', port: 3003 },
];

for (const proto of PROTOTYPES) {
  test(`capture visual snapshots for ${proto.name}`, async ({ page }) => {
    // 1. Desktop Dark
    await page.setViewportSize({ width: 1536, height: 826 });
    await page.goto(`http://localhost:${proto.port}`);
    await page.screenshot({ path: `screenshots/${proto.name}-desktop-dark.png` });

    // 2. Light Mode
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.screenshot({ path: `screenshots/${proto.name}-desktop-light.png` });

    // 3. Tablet Viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: `screenshots/${proto.name}-tablet-light.png` });

    // 4. RTL Arabic Mode
    await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl'));
    await page.screenshot({ path: `screenshots/${proto.name}-tablet-rtl.png` });
  });
}
```

---

## HT-01-01: Monorepo Scaffold & Workspace Conventions

- **Kanban Task:** `TSK-01-01`
- **Category:** Monorepo & Configuration
- **Target Files:** `pnpm-workspace.yaml`, `Cargo.toml`

### Guidelines
- Keep JavaScript/TypeScript apps under `apps/` and shared packages under `packages/`.
- Root Cargo workspace defines common dependencies, profile optimizations, and workspace lints (`clippy`).
- Never introduce cyclic dependencies between packages.

---

## HT-01-02: Rust Platform API Service Skeleton

- **Kanban Task:** `TSK-01-02`
- **Category:** Backend Architecture & Axum
- **Target Path:** `services/platform-api/`

### Guidelines
1. **Layered Module Architecture:** Handlers $\to$ Application Services $\to$ Domain $\to$ Persistence. Domain code must never import Axum, SQLx, or HTTP types.
2. **Centralized Error Handling:** No `unwrap()` or `expect()` in production code. Use `thiserror` mapped centrally to HTTP responses via `IntoResponse`.
3. **Structured Tracing:** Use `tracing` with JSON formatted outputs and request correlation IDs.

### Concrete Example: Centrally Mapped Error Model
```rust
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum PlatformError {
    #[error("Resource not found: {0}")]
    NotFound(String),
    #[error("Optimistic lock conflict: current version is {current}, expected {expected}")]
    Conflict { current: i64, expected: i64 },
    #[error("Authorization denied: required permission '{0}'")]
    Forbidden(String),
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
    #[error("Internal error: {0}")]
    Internal(String),
}

impl IntoResponse for PlatformError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            PlatformError::NotFound(msg) => (StatusCode::NOT_FOUND, msg),
            PlatformError::Conflict { current, expected } => (
                StatusCode::CONFLICT,
                format!("Version conflict: current={}, expected={}", current, expected),
            ),
            PlatformError::Forbidden(perm) => (
                StatusCode::FORBIDDEN,
                format!("Missing required permission: {}", perm),
            ),
            PlatformError::Database(err) => {
                tracing::error!("Database error: {:?}", err);
                (StatusCode::INTERNAL_SERVER_ERROR, "Database transaction error".to_string())
            }
            PlatformError::Internal(err) => {
                tracing::error!("Internal error: {}", err);
                (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error".to_string())
            }
        };

        let body = Json(json!({
            "error": {
                "status": status.as_u16(),
                "message": message,
            }
        }));

        (status, body).into_response()
    }
}
```

---

## HT-01-03: PostgreSQL Migrations & Connection Pooling

- **Kanban Task:** `TSK-01-03`
- **Category:** Persistence & SQLx
- **Target Path:** `database/migrations/`

### Guidelines
- All schema changes must be versioned migrations in `database/migrations/` using `sqlx-cli`.
- Every migration must include a rollback / teardown counterpart where possible.
- Use explicit foreign key constraints, check constraints, and unique indices.

### Verification Recipe
```powershell
# Create new migration
sqlx migrate add create_initial_schema

# Run migrations against local Podman Postgres container
sqlx migrate run --database-url postgres://postgres:devpassword@localhost:5432/platform_dev
```

---

## HT-01-04: Enterprise Studio Design System Package

- **Kanban Task:** `TSK-01-04`
- **Category:** Frontend Styling & Design Tokens
- **Target Path:** `packages/design-system/`

### Guidelines
- Single source of truth for tokens is `packages/design-system/src/tokens.css`.
- No portal component may define raw hex (`#ffffff`) or arbitrary RGB values.
- Dark mode muted text must achieve at least 4.5:1 ratio (`#94a3b8` on `#090a0f`).

---

## HT-01-05: Rootless Podman Compose Stack

- **Kanban Task:** `TSK-01-05`
- **Category:** Containers & Dev Environment
- **Target Path:** `compose.yaml`

### Guidelines
- Rootless by default with ports $>1024$.
- Container names use fully qualified images: `docker.io/library/postgres:18-alpine`, `quay.io/keycloak/keycloak:26.7.2`.
- Testcontainers integration: set `TESTCONTAINERS_RYUK_DISABLED="true"` and label containers with `visual-platform.test=true`.

---

## HT-03-02: HeroUI Drawer, Administrator Governance & Form Canvas

- **Kanban Task:** `TSK-03-02`
- **Phase:** Phase 3
- **Category:** Studio Visual Canvas & 3-Tier Persona Separation
- **Target Path:** `prototypes/prototype-1-studio/app/page.tsx`
- **Guidelines Package:** [`ext/guidelines/TSK-03-02/`](file:///d:/work/Falaj/ext/guidelines/TSK-03-02/)
  - [Architectural Guideline](file:///d:/work/Falaj/ext/guidelines/TSK-03-02/guideline.md)
  - [JSON Schemas & Example](file:///d:/work/Falaj/ext/guidelines/TSK-03-02/example.md)
  - [Interactive Step-by-Step How-To](file:///d:/work/Falaj/ext/guidelines/TSK-03-02/how-to.md)
  - [Verification Test Cases](file:///d:/work/Falaj/ext/guidelines/TSK-03-02/test-cases.md)

### Guidelines
1. **3-Tier Separation:** Administrator governs component availability; Builder drags and drops components into Forms/Canvas; Developer maps RFC 9535 data bindings and mutations.
2. **HeroUI Aesthetic:** Categorized vertical navigation, `All Components (React)` pill, and real-time status badges (`New`, `Updated`, `Restricted`).
3. **Form Container Drop Zone:** Dropping components inside `#node-manager-form` generates responsive sub-grid children with unique IDs and default schema bindings.


