-- Migration 0003: Sitemaps, Pages, and Optimistic Lock Page Versions
-- Canonical Page AST storage

CREATE TABLE sitemaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    route_prefix VARCHAR(255) NOT NULL DEFAULT '/',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sitemap_id UUID NOT NULL REFERENCES sitemaps(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    slug VARCHAR(128) NOT NULL,
    title VARCHAR(255) NOT NULL,
    parent_page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
    current_version_number BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_sitemap_page_slug UNIQUE (sitemap_id, slug)
);

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

CREATE INDEX idx_pages_project ON pages(project_id);
CREATE INDEX idx_pages_sitemap ON pages(sitemap_id);
CREATE INDEX idx_page_versions_page ON page_versions(page_id, version_number DESC);
