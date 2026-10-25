-- Migration 0004: Write-Only Credential Vault & Tamper-Evident Audit Trail

CREATE TABLE credential_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'SET' CHECK (status IN ('SET', 'NOT_SET')),
    encrypted_secret BYTEA NOT NULL,
    kms_key_id VARCHAR(128) NOT NULL,
    last_rotated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_service UNIQUE (project_id, service_name)
);

CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    actor_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(64) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id UUID,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_project_time ON audit_events(project_id, created_at DESC);
CREATE INDEX idx_audit_tenant_time ON audit_events(tenant_id, created_at DESC);
