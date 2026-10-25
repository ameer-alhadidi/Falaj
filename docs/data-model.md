# Data Model Specification
## Enterprise Visual Website Development Platform

- **Status:** Approved Draft (Phase 0A)
- **Author:** Lead Systems Architect / Database Engineer
- **Database Engine:** PostgreSQL 17 / 18
- **ORM / Query Engine:** SQLx with compile-time checked queries and explicit migrations

---

## 1. Relational Entity Relationship Architecture

The persistence model enforces strict referential integrity, cascading controls, and optimistic locking concurrency across all mutable entities.

```
       +-------------------+       +-----------------------+
       |   platform_users  | <---> |  project_memberships  |
       +-------------------+       +-----------+-----------+
                                               |
                                               v
+------------------------+         +-----------+-----------+         +-------------------------+
|   identity_providers   |         |        projects       | ------> |   project_restrictions  |
| (builder/site_visitor) |         +-----+-----+-----+-----+         +-------------------------+
+------------------------+               |     |     |
                                         |     |     |
                    +--------------------+     |     +--------------------+
                    |                          |                          |
                    v                          v                          v
       +------------+-----------+  +-----------+-----------+  +-----------+-----------+
       |     sitemap_nodes      |  |    api_integrations   |  |   release_manifests   |
       +------------+-----------+  +-----------+-----------+  +-----------------------+
                    |                          |
                    v                          v
       +------------+-----------+  +-----------+-----------+
       |     page_definitions   |  |     api_operations    |
       +------------+-----------+  +-----------+-----------+
                    |                          |
                    v                          v
       +------------+-----------+  +-----------+-----------+
       |      page_versions     |  |    encrypted_secrets  |
       |  (Optimistic Lock i64) |  |   (Envelope AES-GCM)  |
       +------------------------+  +-----------------------+
```

---

## 2. Core Table Schemas & Constraints

### 2.1 Identity, Users, and Project Membership

```sql
-- Platform Builder Users (Admins, Developers)
CREATE TABLE platform_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    system_role VARCHAR(50) NOT NULL CHECK (system_role IN ('platform_admin', 'developer', 'viewer')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects (Workspaces)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(64) NOT NULL UNIQUE, -- E.g. 'hr-portal', used in subdomains
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    theme_id VARCHAR(64) NOT NULL DEFAULT 'enterprise-studio',
    theme_version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    adapter_id VARCHAR(64) NOT NULL DEFAULT 'shadcn-ui',
    adapter_version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    default_locale VARCHAR(16) NOT NULL DEFAULT 'en',
    default_direction VARCHAR(8) NOT NULL DEFAULT 'ltr' CHECK (default_direction IN ('ltr', 'rtl')),
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_by UUID NOT NULL REFERENCES platform_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project Memberships & Scoped Roles
CREATE TABLE project_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('project_admin', 'developer', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_member UNIQUE (project_id, user_id)
);

-- Project Restrictions & Quotas (Enforced by Admin)
CREATE TABLE project_restrictions (
    project_id UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
    max_pages INT NOT NULL DEFAULT 1000,
    max_components_per_page INT NOT NULL DEFAULT 500,
    allowed_components JSONB NOT NULL DEFAULT '["*"]', -- List of allowed component types or wildcard
    allowed_api_operations JSONB NOT NULL DEFAULT '[]', -- Whitelist of operation UUIDs
    rate_limit_rpm INT NOT NULL DEFAULT 600,
    require_mfa BOOLEAN NOT NULL DEFAULT false,
    updated_by UUID NOT NULL REFERENCES platform_users(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.2 Sitemaps, Pages, and Optimistic Concurrency

```sql
-- Hierarchical Sitemap
CREATE TABLE sitemap_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES sitemap_nodes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    route_path VARCHAR(255) NOT NULL, -- Relative slug, e.g. 'managers'
    full_path VARCHAR(1024) NOT NULL, -- Computed canonical path, e.g. '/admin/managers'
    is_group BOOLEAN NOT NULL DEFAULT false, -- If true, acts as a virtual folder without a page
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_fullpath UNIQUE (project_id, full_path)
);
CREATE INDEX idx_sitemap_project_parent ON sitemap_nodes(project_id, parent_id, sort_order);

-- Page Definitions
CREATE TABLE page_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sitemap_node_id UUID NOT NULL UNIQUE REFERENCES sitemap_nodes(id) ON DELETE CASCADE,
    current_version_id UUID, -- References active page_versions
    required_permissions JSONB NOT NULL DEFAULT '[]', -- Tier 1: Page access permissions
    locale VARCHAR(16) NOT NULL DEFAULT 'en',
    direction VARCHAR(8) NOT NULL DEFAULT 'ltr' CHECK (direction IN ('ltr', 'rtl')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Versioned Page Content (Optimistic Locking)
CREATE TABLE page_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES page_definitions(id) ON DELETE CASCADE,
    version_number BIGINT NOT NULL, -- Monotonically increasing counter per page
    ast_root JSONB NOT NULL, -- Canonical CanvasComponentNode tree
    status VARCHAR(32) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    commit_message TEXT,
    created_by UUID NOT NULL REFERENCES platform_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_page_version UNIQUE (page_id, version_number)
);
CREATE INDEX idx_page_versions_lookup ON page_versions(page_id, version_number DESC);

-- Active Editor Presence (For Concurrency Warning)
CREATE TABLE page_presence (
    page_id UUID NOT NULL REFERENCES page_definitions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
    heartbeat_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (page_id, user_id)
);
```

### 2.3 API Registry, Operations, and Envelope-Encrypted Secrets

```sql
-- API Integrations
CREATE TABLE api_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_url VARCHAR(1024) NOT NULL, -- Verified by SSRF custom resolver
    auth_type VARCHAR(64) NOT NULL CHECK (auth_type IN ('none', 'bearer', 'oauth2_client_credentials', 'api_key')),
    timeout_ms INT NOT NULL DEFAULT 5000 CHECK (timeout_ms BETWEEN 100 AND 30000),
    max_retries INT NOT NULL DEFAULT 2 CHECK (max_retries BETWEEN 0 AND 3),
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- API Operations (Endpoints)
CREATE TABLE api_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID NOT NULL REFERENCES api_integrations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    method VARCHAR(16) NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')),
    path_template VARCHAR(1024) NOT NULL, -- E.g. '/api/v1/employees/{id}'
    permission_identifier VARCHAR(128) NOT NULL, -- Tier 3: e.g. 'employees.read'
    request_schema JSONB, -- JSON Schema for validation
    response_schema JSONB, -- JSON Schema for inspection and bindings
    is_idempotent BOOLEAN NOT NULL DEFAULT false,
    rate_limit_rpm INT NOT NULL DEFAULT 120,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Envelope Encrypted Secret Storage (Section 9.3)
CREATE TABLE encrypted_secrets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID NOT NULL UNIQUE REFERENCES api_integrations(id) ON DELETE CASCADE,
    key_id VARCHAR(128) NOT NULL, -- Identifier of KMS master key
    encrypted_data_key BYTEA NOT NULL, -- AES-256-GCM encrypted data key
    ciphertext BYTEA NOT NULL, -- Payload encrypted with the data key
    nonce BYTEA NOT NULL, -- 12-byte GCM initialization vector
    auth_tag BYTEA NOT NULL, -- 16-byte GCM authentication tag
    secret_hash VARCHAR(64) NOT NULL, -- One-way hash for integrity verification
    last_rotated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2.4 Releases, Audit Logs, and Identity Providers

```sql
-- Publication Releases (Immutable Releases)
CREATE TABLE release_manifests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    release_number INT NOT NULL,
    manifest JSONB NOT NULL, -- Complete immutable frozen tree of pages, schemas, bindings
    manifest_checksum VARCHAR(64) NOT NULL, -- SHA-256 of canonical manifest JSON
    published_by UUID NOT NULL REFERENCES platform_users(id),
    rollback_from_release_id UUID REFERENCES release_manifests(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_release UNIQUE (project_id, release_number)
);

-- Centralized Audit Trail (Section 7.2 & 9.1)
CREATE TABLE audit_events (
    id BIGSERIAL PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    actor_id UUID, -- User ID or 'system'
    actor_context VARCHAR(32) NOT NULL CHECK (actor_context IN ('builder', 'site_visitor', 'broker', 'system')),
    event_type VARCHAR(128) NOT NULL, -- E.g. 'page.published', 'broker.call', 'secret.rotated'
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(128) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}', -- Redacted; secrets are NEVER written here
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_project_time ON audit_events(project_id, created_at DESC);
CREATE INDEX idx_audit_event_type ON audit_events(event_type, created_at DESC);
```

---

## 3. Concurrency & Optimistic Locking Semantics (Section 9.2)

1. **Monotonic Version Counter:** Every `page_definitions` record tracks its `current_version_id`. Each save creates a new `page_versions` entry with `version_number = current_version + 1`.
2. **Conflict Detection:** The client transmits `expected_version`. If `SELECT version_number FROM page_definitions WHERE id = $1` does not match `expected_version`, the API rejects the request with HTTP `409 Conflict`.
3. **Conflict Resolution Options:**
   - **Reload:** Fetch the latest version from server, discarding local changes.
   - **Compare (Diff):** Compute a 3-way AST JSON diff displaying conflicting component nodes.
   - **Force Overwrite:** Allowed only for users with `project_admin` role; writes a new revision referencing the prior commit.
