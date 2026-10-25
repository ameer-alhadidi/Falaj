'use client';

import React, { useState, useEffect } from 'react';
import initialAdminState from '../fixtures/admin-state.json';
import {
  ShieldCheck,
  FolderKanban,
  Server,
  KeyRound,
  Users,
  History,
  Plus,
  Sliders,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight,
  Database,
  RefreshCw,
  Eye,
  Settings2,
} from 'lucide-react';

type AdminTab = 'projects' | 'apis' | 'identity' | 'audit';
type ThemeMode = 'dark' | 'light';
type Direction = 'ltr' | 'rtl';

export default function AdminGatewayPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [direction, setDirection] = useState<Direction>('ltr');

  const [projects, setProjects] = useState(initialAdminState.projects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-hr-portal');
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);

  // New Project Form
  const [newProjectCode, setNewProjectCode] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  // Apply Theme & Direction
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    localStorage.setItem('visual-platform-theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
  }, [direction]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectCode || !newProjectName) return;

    const created = {
      id: `proj-${newProjectCode.toLowerCase()}`,
      code: newProjectCode.toLowerCase(),
      displayName: newProjectName,
      description: newProjectDesc || 'Enterprise business application.',
      themeId: 'enterprise-studio',
      themeVersion: '1.0.0',
      adapter: 'shadcn-ui@1.0.0',
      framework: 'Next.js 15 App Router',
      members: [{ name: 'Sara Al-Hashimi', role: 'Project Admin', email: 'sara@enterprise.com' }],
      quotas: {
        maxPages: 500,
        maxComponentsPerPage: 300,
        rateLimitRpm: 600,
      },
      allowedAdapters: ['shadcn-ui'],
      allowedThemes: ['enterprise-studio'],
    };

    setProjects((prev) => [...prev, created]);
    setSelectedProjectId(created.id);
    setShowNewProjectModal(false);
    setNewProjectCode('');
    setNewProjectName('');
    setNewProjectDesc('');
    alert(`Project '${created.displayName}' created with default security restrictions!`);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--portal-bg)',
      }}
    >
      {/* Top Application Header */}
      <header
        style={{
          height: 'var(--topbar-height)',
          background: 'var(--portal-surface)',
          borderBottom: '1px solid var(--portal-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #ef4444, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.95rem',
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>Security & Admin Gateway</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: 'var(--portal-error)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontWeight: 700,
                }}
              >
                TIER 4 ADMIN
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--portal-text-muted)' }}>
              Sara Al-Hashimi (Lead Platform Administrator) &bull; Enterprise Studio
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
            style={{
              background: 'var(--portal-surface-elevated)',
              border: '1px solid var(--portal-border)',
              color: 'var(--portal-text-primary)',
              padding: '5px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Globe size={13} /> {direction.toUpperCase()}
          </button>

          <button
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            style={{
              background: 'var(--portal-surface-elevated)',
              border: '1px solid var(--portal-border)',
              color: 'var(--portal-text-primary)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {themeMode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      {/* Main Body: Sidebar + Active Console Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Navigation Sidebar */}
        <aside
          style={{
            width: 'var(--sidebar-width)',
            background: 'var(--portal-surface)',
            borderInlineEnd: '1px solid var(--portal-border)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem 0.75rem',
            gap: '0.35rem',
          }}
        >
          <div
            style={{
              padding: '0 0.5rem 0.5rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--portal-text-muted)',
            }}
          >
            Governance Console
          </div>

          {[
            { id: 'projects', label: 'Projects & Quotas', icon: FolderKanban },
            { id: 'apis', label: 'API Registry & Vault', icon: Server },
            { id: 'identity', label: 'Dual Identity & OIDC', icon: KeyRound },
            { id: 'audit', label: 'Audit Trail Feed', icon: History },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                style={{
                  background: active ? 'var(--portal-surface-hover)' : 'transparent',
                  border: 'none',
                  borderInlineStart: active
                    ? '3px solid var(--portal-accent)'
                    : '3px solid transparent',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  color: active ? 'var(--portal-accent)' : 'var(--portal-text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: active ? 600 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'start',
                  transition: 'var(--transition)',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div
            style={{
              marginTop: 'auto',
              padding: '0.75rem',
              background: 'var(--portal-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--portal-border)',
            }}
          >
            <div
              style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                color: 'var(--portal-text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Lock size={12} style={{ color: 'var(--portal-success)' }} /> Envelope Encryption
            </div>
            <p
              style={{
                fontSize: '0.675rem',
                color: 'var(--portal-text-muted)',
                marginTop: '2px',
                lineHeight: 1.4,
              }}
            >
              AES-256-GCM data keys active with local KMS master key. Secrets write-only.
            </p>
          </div>
        </aside>

        {/* Center Active Workspace */}
        <main
          style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: 'var(--portal-bg)' }}
        >
          {/* TAB 1: PROJECTS & RESTRICTIONS */}
          {activeTab === 'projects' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                maxWidth: '1100px',
                margin: '0 auto',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div>
                  <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    Project Restrictions & Governance
                  </h1>
                  <p style={{ fontSize: '0.8rem', color: 'var(--portal-text-secondary)' }}>
                    Administrators restrict available themes, component libraries, and page quotas
                    per project.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  style={{
                    background: 'var(--portal-accent)',
                    color: 'var(--portal-accent-foreground)',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Plus size={15} /> New Project
                </button>
              </div>

              {/* Projects Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    style={{
                      background: 'var(--portal-surface)',
                      border: `1px solid ${selectedProjectId === proj.id ? 'var(--portal-border-active)' : 'var(--portal-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.725rem',
                          fontFamily: 'var(--font-mono)',
                          background: 'var(--portal-surface-elevated)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          color: 'var(--portal-accent)',
                        }}
                      >
                        {proj.code}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--portal-text-muted)' }}>
                        {proj.framework}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      {proj.displayName}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.775rem',
                        color: 'var(--portal-text-secondary)',
                        marginBottom: '0.75rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {proj.description}
                    </p>

                    <div
                      style={{
                        borderTop: '1px solid var(--portal-border)',
                        paddingTop: '0.75rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.5rem',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          background: 'var(--portal-surface-elevated)',
                          padding: '6px',
                          borderRadius: '4px',
                        }}
                      >
                        <div style={{ fontSize: '0.675rem', color: 'var(--portal-text-muted)' }}>
                          Max Pages
                        </div>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: 'var(--portal-text-primary)',
                          }}
                        >
                          {proj.quotas.maxPages}
                        </div>
                      </div>
                      <div
                        style={{
                          background: 'var(--portal-surface-elevated)',
                          padding: '6px',
                          borderRadius: '4px',
                        }}
                      >
                        <div style={{ fontSize: '0.675rem', color: 'var(--portal-text-muted)' }}>
                          Max Nodes/Page
                        </div>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: 'var(--portal-text-primary)',
                          }}
                        >
                          {proj.quotas.maxComponentsPerPage}
                        </div>
                      </div>
                      <div
                        style={{
                          background: 'var(--portal-surface-elevated)',
                          padding: '6px',
                          borderRadius: '4px',
                        }}
                      >
                        <div style={{ fontSize: '0.675rem', color: 'var(--portal-text-muted)' }}>
                          Rate Limit
                        </div>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: 'var(--portal-text-primary)',
                          }}
                        >
                          {proj.quotas.rateLimitRpm} rpm
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Project Detailed Governance Panel */}
              <div
                style={{
                  background: 'var(--portal-surface)',
                  border: '1px solid var(--portal-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                }}
              >
                <h2
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Settings2 size={16} style={{ color: 'var(--portal-accent)' }} />
                  Restrictions for: {selectedProject.displayName}
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                    marginTop: '1rem',
                  }}
                >
                  <div
                    style={{
                      background: 'var(--portal-surface-elevated)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--portal-text-primary)',
                        marginBottom: '4px',
                      }}
                    >
                      Approved Component Adapter
                    </div>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--portal-accent)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {selectedProject.adapter}
                    </div>
                    <p
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--portal-text-muted)',
                        marginTop: '4px',
                      }}
                    >
                      Developers cannot import unauthorized adapters (HeroUI and daisyUI locked
                      until Phase 6).
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'var(--portal-surface-elevated)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--portal-text-primary)',
                        marginBottom: '4px',
                      }}
                    >
                      Active Portal Theme
                    </div>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--portal-success)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {selectedProject.themeId} @ {selectedProject.themeVersion}
                    </div>
                    <p
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--portal-text-muted)',
                        marginTop: '4px',
                      }}
                    >
                      Themed strictly through Enterprise Studio tokens. No hardcoded styles allowed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: API REGISTRY & CREDENTIALS VAULT */}
          {activeTab === 'apis' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                maxWidth: '1100px',
                margin: '0 auto',
              }}
            >
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  API Registry & Write-Only Credential Vault
                </h1>
                <p style={{ fontSize: '0.8rem', color: 'var(--portal-text-secondary)' }}>
                  All upstream integrations are proxied through the Rust broker with SSRF protection
                  and envelope encryption.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {initialAdminState.apiRegistry.map((api) => (
                  <div
                    key={api.id}
                    style={{
                      background: 'var(--portal-surface)',
                      border: '1px solid var(--portal-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database size={16} style={{ color: 'var(--portal-accent)' }} />
                        <span style={{ fontSize: '1rem', fontWeight: 700 }}>{api.name}</span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--portal-text-muted)',
                          }}
                        >
                          {api.baseUrl}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: 'var(--portal-success)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 600,
                          }}
                        >
                          SSRF Filter: ACTIVE
                        </span>
                      </div>
                    </div>

                    {/* Write-Only Credential Vault Card */}
                    <div
                      style={{
                        background: 'var(--portal-surface-elevated)',
                        border: '1px solid var(--portal-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '0.725rem',
                            color: 'var(--portal-text-muted)',
                            textTransform: 'uppercase',
                          }}
                        >
                          Encrypted Credentials (Write-Only)
                        </div>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: 'var(--portal-text-primary)',
                            marginTop: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Lock size={13} style={{ color: 'var(--portal-warning)' }} />
                          <span>
                            Status:{' '}
                            <strong style={{ color: 'var(--portal-success)' }}>
                              {api.credentialStatus}
                            </strong>
                          </span>
                          <span style={{ color: 'var(--portal-text-muted)' }}>&bull;</span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontFamily: 'var(--font-mono)',
                              color: 'var(--portal-text-secondary)',
                            }}
                          >
                            KMS Key: {api.keyId}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--portal-text-muted)',
                            marginTop: '2px',
                          }}
                        >
                          Last Rotated: {new Date(api.lastRotated).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          alert(
                            `Rotated AES-256-GCM data key for ${api.name}. Audit log entry created.`,
                          )
                        }
                        style={{
                          background: 'var(--portal-surface)',
                          border: '1px solid var(--portal-border)',
                          color: 'var(--portal-accent)',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <RefreshCw size={12} /> Rotate Key
                      </button>
                    </div>

                    {/* Approved Operations */}
                    <div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: 'var(--portal-text-secondary)',
                          marginBottom: '0.4rem',
                        }}
                      >
                        Approved Endpoints ({api.operations.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {api.operations.map((op) => (
                          <div
                            key={op.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: 'var(--portal-surface-elevated)',
                              padding: '6px 10px',
                              borderRadius: '4px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  fontSize: '0.675rem',
                                  fontWeight: 700,
                                  fontFamily: 'var(--font-mono)',
                                  background:
                                    op.method === 'GET'
                                      ? 'rgba(59, 130, 246, 0.2)'
                                      : 'rgba(16, 185, 129, 0.2)',
                                  color:
                                    op.method === 'GET'
                                      ? 'var(--portal-accent)'
                                      : 'var(--portal-success)',
                                  padding: '2px 6px',
                                  borderRadius: '3px',
                                }}
                              >
                                {op.method}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.775rem',
                                  fontWeight: 600,
                                  color: 'var(--portal-text-primary)',
                                }}
                              >
                                {op.name}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontFamily: 'var(--font-mono)',
                                  color: 'var(--portal-text-muted)',
                                }}
                              >
                                {op.path}
                              </span>
                            </div>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--portal-warning)',
                              }}
                            >
                              permission: {op.permission}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DUAL IDENTITY CONTEXTS */}
          {activeTab === 'identity' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                maxWidth: '1100px',
                margin: '0 auto',
              }}
            >
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Dual Identity Architecture (Section 4.3)
                </h1>
                <p style={{ fontSize: '0.8rem', color: 'var(--portal-text-secondary)' }}>
                  Builder identity and site-visitor identity are strictly separated across realms,
                  cookies, and database tables.
                </p>
              </div>

              <div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}
              >
                {/* Context 1: Builder Identity */}
                <div
                  style={{
                    background: 'var(--portal-surface)',
                    border: '1px solid var(--portal-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <ShieldCheck size={18} style={{ color: 'var(--portal-accent)' }} />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                      Builder Identity Context
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--portal-text-secondary)',
                      marginBottom: '1rem',
                      lineHeight: 1.4,
                    }}
                  >
                    Controls access to the Platform Studio, API Registries, and publishing
                    functions. Never grants rights to published sites.
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      fontSize: '0.775rem',
                    }}
                  >
                    <div
                      style={{
                        background: 'var(--portal-surface-elevated)',
                        padding: '8px',
                        borderRadius: '4px',
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--portal-text-muted)',
                          display: 'block',
                          fontSize: '0.675rem',
                        }}
                      >
                        Keycloak Realm
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--portal-text-primary)',
                        }}
                      >
                        platform-management
                      </span>
                    </div>
                    <div
                      style={{
                        background: 'var(--portal-surface-elevated)',
                        padding: '8px',
                        borderRadius: '4px',
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--portal-text-muted)',
                          display: 'block',
                          fontSize: '0.675rem',
                        }}
                      >
                        Session Storage
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--portal-text-primary)',
                        }}
                      >
                        HttpOnly, SameSite=Lax (8h lifetime)
                      </span>
                    </div>
                    <div
                      style={{
                        background: 'var(--portal-surface-elevated)',
                        padding: '8px',
                        borderRadius: '4px',
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--portal-text-muted)',
                          display: 'block',
                          fontSize: '0.675rem',
                        }}
                      >
                        Platform Roles
                      </span>
                      <span
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--portal-accent)' }}
                      >
                        platform_admin, developer, viewer
                      </span>
                    </div>
                  </div>
                </div>

                {/* Context 2: Site Visitor Identity */}
                <div
                  style={{
                    background: 'var(--portal-surface)',
                    border: '1px solid var(--portal-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <Users size={18} style={{ color: 'var(--portal-success)' }} />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                      Site-Visitor Identity Context
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--portal-text-secondary)',
                      marginBottom: '1rem',
                      lineHeight: 1.4,
                    }}
                  >
                    Controls visitor access to published pages and brokered APIs per project.
                    Completely isolated from builder sessions.
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      fontSize: '0.775rem',
                    }}
                  >
                    <div
                      style={{
                        background: 'var(--portal-surface-elevated)',
                        padding: '8px',
                        borderRadius: '4px',
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--portal-text-muted)',
                          display: 'block',
                          fontSize: '0.675rem',
                        }}
                      >
                        Project Realm
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--portal-text-primary)',
                        }}
                      >
                        project-hr-portal-visitors
                      </span>
                    </div>
                    <div
                      style={{
                        background: 'var(--portal-surface-elevated)',
                        padding: '8px',
                        borderRadius: '4px',
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--portal-text-muted)',
                          display: 'block',
                          fontSize: '0.675rem',
                        }}
                      >
                        Claim Mapping
                      </span>
                      <span
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--portal-success)' }}
                      >
                        roles -&gt; permissions (e.g. managers.read)
                      </span>
                    </div>
                    <div
                      style={{
                        background: 'var(--portal-surface-elevated)',
                        padding: '8px',
                        borderRadius: '4px',
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--portal-text-muted)',
                          display: 'block',
                          fontSize: '0.675rem',
                        }}
                      >
                        Enforcement Boundary
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--portal-text-primary)',
                        }}
                      >
                        Server SSR & Broker (Stripped if missing)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT TRAIL FEED */}
          {activeTab === 'audit' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                maxWidth: '1100px',
                margin: '0 auto',
              }}
            >
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Immutable Platform Audit Trail
                </h1>
                <p style={{ fontSize: '0.8rem', color: 'var(--portal-text-secondary)' }}>
                  Records every administrative configuration change, publication event, and
                  credential rotation.
                </p>
              </div>

              <div
                style={{
                  background: 'var(--portal-surface)',
                  border: '1px solid var(--portal-border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr
                      style={{
                        background: 'var(--portal-surface-elevated)',
                        borderBottom: '1px solid var(--portal-border)',
                      }}
                    >
                      <th
                        style={{
                          padding: '0.75rem 1rem',
                          textAlign: 'start',
                          color: 'var(--portal-text-secondary)',
                          fontWeight: 600,
                        }}
                      >
                        Timestamp
                      </th>
                      <th
                        style={{
                          padding: '0.75rem 1rem',
                          textAlign: 'start',
                          color: 'var(--portal-text-secondary)',
                          fontWeight: 600,
                        }}
                      >
                        Actor
                      </th>
                      <th
                        style={{
                          padding: '0.75rem 1rem',
                          textAlign: 'start',
                          color: 'var(--portal-text-secondary)',
                          fontWeight: 600,
                        }}
                      >
                        Event Action
                      </th>
                      <th
                        style={{
                          padding: '0.75rem 1rem',
                          textAlign: 'start',
                          color: 'var(--portal-text-secondary)',
                          fontWeight: 600,
                        }}
                      >
                        Target Resource
                      </th>
                      <th
                        style={{
                          padding: '0.75rem 1rem',
                          textAlign: 'start',
                          color: 'var(--portal-text-secondary)',
                          fontWeight: 600,
                        }}
                      >
                        Details
                      </th>
                      <th
                        style={{
                          padding: '0.75rem 1rem',
                          textAlign: 'start',
                          color: 'var(--portal-text-secondary)',
                          fontWeight: 600,
                        }}
                      >
                        IP Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {initialAdminState.auditEvents.map((evt) => (
                      <tr key={evt.id} style={{ borderBottom: '1px solid var(--portal-border)' }}>
                        <td
                          style={{
                            padding: '0.75rem 1rem',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--portal-text-muted)',
                          }}
                        >
                          {new Date(evt.timestamp).toLocaleTimeString()}
                        </td>
                        <td
                          style={{
                            padding: '0.75rem 1rem',
                            fontWeight: 600,
                            color: 'var(--portal-text-primary)',
                          }}
                        >
                          {evt.actor}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span
                            style={{
                              background: 'rgba(59, 130, 246, 0.15)',
                              color: 'var(--portal-accent)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.725rem',
                            }}
                          >
                            {evt.action}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '0.75rem 1rem',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--portal-text-secondary)',
                          }}
                        >
                          {evt.resource}
                        </td>
                        <td
                          style={{ padding: '0.75rem 1rem', color: 'var(--portal-text-secondary)' }}
                        >
                          {evt.details}
                        </td>
                        <td
                          style={{
                            padding: '0.75rem 1rem',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--portal-text-muted)',
                            fontSize: '0.725rem',
                          }}
                        >
                          {evt.ip}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: 'var(--portal-surface)',
              border: '1px solid var(--portal-border)',
              borderRadius: 'var(--radius-lg)',
              width: '100%',
              maxWidth: '520px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--portal-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--portal-surface-elevated)',
              }}
            >
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Create New Enterprise Project</h2>
              <button
                onClick={() => setShowNewProjectModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--portal-text-secondary)',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                }}
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleCreateProject}
              style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--portal-text-secondary)',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Project Code (Subdomain Identifier)
                </label>
                <input
                  type="text"
                  placeholder="e.g. portal-crm"
                  required
                  value={newProjectCode}
                  onChange={(e) => setNewProjectCode(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--portal-surface-elevated)',
                    border: '1px solid var(--portal-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    color: 'var(--portal-text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--portal-text-secondary)',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Corporate CRM & Sales"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--portal-surface-elevated)',
                    border: '1px solid var(--portal-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    color: 'var(--portal-text-primary)',
                    fontSize: '0.8rem',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--portal-text-secondary)',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Description
                </label>
                <textarea
                  placeholder="Project purpose, scope and team assignment."
                  rows={3}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--portal-surface-elevated)',
                    border: '1px solid var(--portal-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    color: 'var(--portal-text-primary)',
                    fontSize: '0.8rem',
                    resize: 'none',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  style={{
                    background: 'var(--portal-surface-elevated)',
                    border: '1px solid var(--portal-border)',
                    color: 'var(--portal-text-primary)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'var(--portal-accent)',
                    border: 'none',
                    color: 'var(--portal-accent-foreground)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
