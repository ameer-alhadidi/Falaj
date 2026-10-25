-- Migration 0001: Tenants, Projects, and Restrictions
-- Conforms to docs/data-model.md Section 2

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tenants Table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(63) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(63) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_project_slug UNIQUE (tenant_id, slug)
);

-- Project Restrictions Table (Tier 4 Governance & Quotas)
CREATE TABLE project_restrictions (
    project_id UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
    max_pages INT NOT NULL DEFAULT 50,
    max_components_per_page INT NOT NULL DEFAULT 250,
    rate_limit_rpm INT NOT NULL DEFAULT 600,
    allowed_adapters JSONB NOT NULL DEFAULT '["shadcn/ui"]'::jsonb,
    allowed_themes JSONB NOT NULL DEFAULT '["enterprise-studio"]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_tenant ON projects(tenant_id);
