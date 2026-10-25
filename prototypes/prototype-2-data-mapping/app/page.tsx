'use client';

import React, { useState, useEffect } from 'react';
import fixtureData from '../fixtures/api-response.json';
import schemaData from '../fixtures/component-schema.json';
import {
  Database,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sun,
  Moon,
  Globe,
  Search,
  ChevronDown,
  ChevronRight,
  Code,
  Layers,
  Sparkles,
  RefreshCw,
  Table as TableIcon,
} from 'lucide-react';

type SimulatedState = 'default' | 'loading' | 'empty' | 'error';
type ThemeMode = 'dark' | 'light';
type Direction = 'ltr' | 'rtl';

export default function DataMappingMatrixPage() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [simulatedState, setSimulatedState] = useState<SimulatedState>('default');

  // Mapping state
  const [collectionPath, setCollectionPath] = useState<string>('$.data');
  const [mappings, setMappings] = useState<Record<string, string>>({
    id: '@.id',
    name: '@.name',
    department: '@.department.name',
    jobTitle: '@.jobTitle',
    email: '@.email',
    active: '@.active',
  });

  const [activeSlot, setActiveSlot] = useState<string>('department');
  const [customPathInput, setCustomPathInput] = useState<string>('@.department.name');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    root: true,
    data: true,
    data0: true,
    dept: true,
  });

  // Apply Theme & Direction
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    localStorage.setItem('visual-platform-theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
  }, [direction]);

  // RFC 9535 Validator
  const validatePath = (path: string): string | null => {
    if (!path.startsWith('@.') && !path.startsWith('$.')) {
      return "Expression must start with '$' (response root) or '@' (item root).";
    }
    if (path.includes('?(')) {
      return "Disallowed selector: filter expressions '?()' are prohibited in RFC 9535 binding subset.";
    }
    if (path.includes('..')) {
      return "Disallowed selector: recursive descent '..' is prohibited to prevent ReDoS.";
    }
    if (path.includes('[-')) {
      return 'Disallowed selector: negative array indexing is not supported.';
    }
    return null;
  };

  const handleApplyMapping = (slot: string, path: string) => {
    const error = validatePath(path);
    setValidationError(error);
    if (!error) {
      setMappings((prev) => ({ ...prev, [slot]: path }));
    }
  };

  const rawEmployees = fixtureData.response.data;

  // Evaluate single path against employee item
  const evaluatePath = (path: string, item: any): any => {
    try {
      if (path === '@.id') return item.id;
      if (path === '@.name') return item.name;
      if (path === '@.department.name') return item.department?.name;
      if (path === '@.department.code') return item.department?.code;
      if (path === '@.jobTitle') return item.jobTitle;
      if (path === '@.email') return item.email;
      if (path === '@.active') return item.active ? 'Active' : 'Inactive';
      return 'N/A';
    } catch (e) {
      return 'Err';
    }
  };

  const toggleExpand = (nodeKey: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeKey]: !prev[nodeKey] }));
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
      {/* Top Application Toolbar */}
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
              width: '30px',
              height: '30px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            M
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
              <span>Prototype 2</span>
              <span style={{ color: 'var(--portal-text-muted)' }}>/</span>
              <span>API & Data-Binding Matrix</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--portal-text-muted)' }}>
              RFC 9535 Syntax Engine &bull; Collection `$` &bull; Item `@`
            </div>
          </div>
        </div>

        {/* State Simulator & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--portal-surface-elevated)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--portal-border)',
            }}
          >
            <span
              style={{
                fontSize: '0.725rem',
                color: 'var(--portal-text-secondary)',
                fontWeight: 600,
              }}
            >
              Simulate:
            </span>
            {(['default', 'loading', 'empty', 'error'] as SimulatedState[]).map((state) => (
              <button
                key={state}
                onClick={() => setSimulatedState(state)}
                style={{
                  background: simulatedState === state ? 'var(--portal-accent)' : 'transparent',
                  color: simulatedState === state ? '#fff' : 'var(--portal-text-secondary)',
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {state}
              </button>
            ))}
          </div>

          {/* RTL Toggle */}
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

          {/* Theme Toggle */}
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

      {/* 3-Column Binding Matrix Layout */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '320px 360px 1fr',
          overflow: 'hidden',
        }}
      >
        {/* COLUMN 1: LEFT SANITIZED JSON TREE */}
        <section
          style={{
            background: 'var(--portal-surface)',
            borderInlineEnd: '1px solid var(--portal-border)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Operation Header */}
          <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--portal-border)' }}>
            <div
              style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--portal-text-muted)',
              }}
            >
              Source API Operation
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--portal-accent)',
                marginTop: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Database size={14} /> GET /api/v1/employees
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--portal-text-secondary)',
                marginTop: '2px',
              }}
            >
              Core HR Directory Service (200 OK &bull; 5 items)
            </div>
          </div>

          {/* Tree Search Box */}
          <div
            style={{
              padding: '0.5rem 1rem',
              borderBottom: '1px solid var(--portal-border)',
              background: 'var(--portal-surface-elevated)',
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search
                size={13}
                style={{ position: 'absolute', left: '8px', color: 'var(--portal-text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search JSON response fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--portal-surface)',
                  border: '1px solid var(--portal-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px 4px 28px',
                  fontSize: '0.75rem',
                  color: 'var(--portal-text-primary)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Expandable JSON Tree Nodes */}
          <div
            style={{
              padding: '0.75rem',
              fontSize: '0.775rem',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}
          >
            {/* Root Node */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--portal-text-muted)',
              }}
            >
              <ChevronDown size={13} />
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>$</span>
              <span>(Response Root Object)</span>
            </div>

            {/* $.status */}
            <div
              style={{
                paddingInlineStart: '1.25rem',
                color: 'var(--portal-text-secondary)',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>
                status: <span style={{ color: '#34d399' }}>"success"</span>
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--portal-text-muted)' }}>string</span>
            </div>

            {/* $.total */}
            <div
              onClick={() => {
                setCollectionPath('$.total');
                alert("Selected '$.total' for total count metadata mapping.");
              }}
              style={{
                paddingInlineStart: '1.25rem',
                color: 'var(--portal-text-secondary)',
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
                padding: '2px 4px 2px 1.25rem',
                borderRadius: '4px',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'var(--portal-surface-hover)')
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span>
                total: <span style={{ color: '#60a5fa' }}>5</span>
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--portal-accent)' }}>
                + Total Path
              </span>
            </div>

            {/* $.data Array Node */}
            <div
              onClick={() => toggleExpand('data')}
              style={{
                paddingInlineStart: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#fbbf24',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '4px',
              }}
            >
              {expandedNodes.data ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              <span>data: [ ... ]</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  color: 'var(--portal-accent)',
                  background: 'rgba(59, 130, 246, 0.15)',
                  padding: '1px 5px',
                  borderRadius: '4px',
                }}
              >
                Collection Array
              </span>
            </div>

            {/* Array Items Inside $.data */}
            {expandedNodes.data && (
              <div
                style={{
                  paddingInlineStart: '2.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                }}
              >
                {/* [0] Item Template */}
                <div
                  onClick={() => toggleExpand('data0')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--portal-text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {expandedNodes.data0 ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  <span style={{ color: '#a855f7' }}>@ [0]</span>
                  <span>(Current Collection Item)</span>
                </div>

                {expandedNodes.data0 && (
                  <div
                    style={{
                      paddingInlineStart: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    {[
                      { field: 'id', path: '@.id', val: '101', type: 'number' },
                      { field: 'name', path: '@.name', val: '"Ahmed Al-Harthy"', type: 'string' },
                      {
                        field: 'jobTitle',
                        path: '@.jobTitle',
                        val: '"Finance Manager"',
                        type: 'string',
                      },
                      { field: 'email', path: '@.email', val: '"ahmed@..."', type: 'string' },
                      { field: 'active', path: '@.active', val: 'true', type: 'boolean' },
                    ].map((f) => (
                      <div
                        key={f.field}
                        onClick={() => {
                          setCustomPathInput(f.path);
                          handleApplyMapping(activeSlot, f.path);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '3px 6px',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          background:
                            mappings[activeSlot] === f.path
                              ? 'rgba(59, 130, 246, 0.15)'
                              : 'transparent',
                          border:
                            mappings[activeSlot] === f.path
                              ? '1px solid var(--portal-border-active)'
                              : '1px solid transparent',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = 'var(--portal-surface-hover)')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            mappings[activeSlot] === f.path
                              ? 'rgba(59, 130, 246, 0.15)'
                              : 'transparent')
                        }
                      >
                        <span style={{ color: 'var(--portal-text-primary)' }}>
                          {f.field}: <span style={{ color: '#94a3b8' }}>{f.val}</span>
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--portal-accent)' }}>
                          {f.path}
                        </span>
                      </div>
                    ))}

                    {/* Nested department object */}
                    <div
                      onClick={() => toggleExpand('dept')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#fbbf24',
                        cursor: 'pointer',
                        marginTop: '2px',
                      }}
                    >
                      {expandedNodes.dept ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      <span>department: &#123; &#125;</span>
                    </div>

                    {expandedNodes.dept && (
                      <div
                        style={{
                          paddingInlineStart: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px',
                        }}
                      >
                        <div
                          onClick={() => {
                            setCustomPathInput('@.department.name');
                            handleApplyMapping(activeSlot, '@.department.name');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '3px 6px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            background:
                              mappings[activeSlot] === '@.department.name'
                                ? 'rgba(59, 130, 246, 0.15)'
                                : 'transparent',
                            border:
                              mappings[activeSlot] === '@.department.name'
                                ? '1px solid var(--portal-border-active)'
                                : '1px solid transparent',
                          }}
                        >
                          <span style={{ color: 'var(--portal-text-primary)' }}>
                            name: <span style={{ color: '#34d399' }}>"Finance"</span>
                          </span>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              color: 'var(--portal-accent)',
                              fontWeight: 600,
                            }}
                          >
                            @.department.name
                          </span>
                        </div>

                        <div
                          onClick={() => {
                            setCustomPathInput('@.department.code');
                            handleApplyMapping(activeSlot, '@.department.code');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '3px 6px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ color: 'var(--portal-text-primary)' }}>
                            code: <span style={{ color: '#34d399' }}>"FIN"</span>
                          </span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--portal-text-muted)' }}>
                            @.department.code
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* COLUMN 2: CENTER MAPPING & VALIDATION MATRIX */}
        <section
          style={{
            background: 'var(--portal-bg)',
            borderInlineEnd: '1px solid var(--portal-border)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.25rem',
            overflowY: 'auto',
            gap: '1.25rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Binding Connector Matrix
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--portal-text-secondary)' }}>
              Configure collection repeater roots and individual field projections.
            </p>
          </div>

          {/* Collection Repeater Path Input */}
          <div
            style={{
              background: 'var(--portal-surface)',
              border: '1px solid var(--portal-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
            }}
          >
            <label
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--portal-text-primary)',
                display: 'block',
                marginBottom: '0.35rem',
              }}
            >
              Repeater Collection Path ($-Rooted)
            </label>
            <input
              type="text"
              value={collectionPath}
              onChange={(e) => setCollectionPath(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--portal-surface-elevated)',
                border: '1px solid var(--portal-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                color: 'var(--portal-accent)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.825rem',
                fontWeight: 600,
                outline: 'none',
              }}
            />
            <p
              style={{
                fontSize: '0.675rem',
                color: 'var(--portal-text-muted)',
                marginTop: '0.35rem',
              }}
            >
              The collection array containing items to iterate through for each repeated row.
            </p>
          </div>

          {/* Active Field Mapping Selector */}
          <div
            style={{
              background: 'var(--portal-surface)',
              border: '1px solid var(--portal-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--portal-text-primary)',
                }}
              >
                Field Projection Mappings (@-Rooted)
              </label>
              <span
                style={{
                  fontSize: '0.675rem',
                  color: 'var(--portal-accent)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                6 Slots
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {schemaData.slots.map((slot) => (
                <div
                  key={slot.field}
                  onClick={() => {
                    setActiveSlot(slot.field);
                    setCustomPathInput(mappings[slot.field] || '');
                    setValidationError(null);
                  }}
                  style={{
                    background:
                      activeSlot === slot.field
                        ? 'var(--portal-surface-hover)'
                        : 'var(--portal-surface-elevated)',
                    border: `1px solid ${activeSlot === slot.field ? 'var(--portal-border-active)' : 'var(--portal-border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem 0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'var(--transition)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '0.775rem',
                        fontWeight: 600,
                        color: 'var(--portal-text-primary)',
                      }}
                    >
                      {slot.label}
                    </div>
                    <div style={{ fontSize: '0.675rem', color: 'var(--portal-text-muted)' }}>
                      slot: {slot.field} ({slot.format})
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.725rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--portal-accent)',
                        fontWeight: 600,
                      }}
                    >
                      {mappings[slot.field]}
                    </span>
                    <ArrowRight size={13} style={{ color: 'var(--portal-text-muted)' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Path Editor & Validation */}
            <div
              style={{
                borderTop: '1px solid var(--portal-border)',
                paddingTop: '0.75rem',
                marginTop: '0.25rem',
              }}
            >
              <label
                style={{
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  color: 'var(--portal-text-secondary)',
                  display: 'block',
                  marginBottom: '0.35rem',
                }}
              >
                Expression for Slot:{' '}
                <span style={{ color: 'var(--portal-accent)' }}>{activeSlot}</span>
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  value={customPathInput}
                  onChange={(e) => {
                    setCustomPathInput(e.target.value);
                    const err = validatePath(e.target.value);
                    setValidationError(err);
                  }}
                  style={{
                    flex: 1,
                    background: 'var(--portal-surface-elevated)',
                    border: `1px solid ${validationError ? 'var(--portal-error)' : 'var(--portal-border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 8px',
                    color: 'var(--portal-text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                  }}
                />
                <button
                  onClick={() => handleApplyMapping(activeSlot, customPathInput)}
                  style={{
                    background: 'var(--portal-accent)',
                    color: 'var(--portal-accent-foreground)',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Apply
                </button>
              </div>

              {/* Live RFC 9535 Syntax Feedback */}
              {validationError ? (
                <div
                  style={{
                    marginTop: '0.5rem',
                    padding: '6px 8px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid var(--portal-error)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--portal-error)',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '5px',
                  }}
                >
                  <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{validationError}</span>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: 'var(--portal-success)',
                    fontSize: '0.7rem',
                  }}
                >
                  <CheckCircle size={13} />
                  <span>RFC 9535 syntax valid. Complies with security subset.</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* COLUMN 3: RIGHT LIVE REPEATED TABLE PREVIEW */}
        <section
          style={{
            background: 'var(--portal-surface)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.25rem',
            overflowY: 'auto',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                Live Repeated Component Preview
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--portal-text-secondary)' }}>
                Target: <code>&lt;Table /&gt;</code> component rendered with current bindings.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '0.675rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--portal-success)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}
              >
                {rawEmployees.length} Repeated Rows
              </span>
            </div>
          </div>

          {/* SIMULATED STATE: LOADING */}
          {simulatedState === 'loading' && (
            <div
              style={{
                padding: '3rem',
                textAlign: 'center',
                background: 'var(--portal-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--portal-border)',
              }}
            >
              <RefreshCw
                size={24}
                style={{
                  animation: 'spin 1s linear infinite',
                  color: 'var(--portal-accent)',
                  margin: '0 auto 0.75rem',
                }}
              />
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--portal-text-primary)',
                }}
              >
                Evaluating RFC 9535 Bindings...
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
                Fetching collection from Upstream Core HR Broker
              </div>
            </div>
          )}

          {/* SIMULATED STATE: EMPTY */}
          {simulatedState === 'empty' && (
            <div
              style={{
                padding: '3rem',
                textAlign: 'center',
                background: 'var(--portal-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--portal-border)',
              }}
            >
              <Database
                size={24}
                style={{ color: 'var(--portal-text-muted)', margin: '0 auto 0.75rem' }}
              />
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--portal-text-primary)',
                }}
              >
                Empty Collection
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
                Path '$.data' evaluated to 0 items. Empty template active.
              </div>
            </div>
          )}

          {/* SIMULATED STATE: ERROR */}
          {simulatedState === 'error' && (
            <div
              style={{
                padding: '3rem',
                textAlign: 'center',
                background: 'var(--portal-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--portal-error)',
              }}
            >
              <AlertTriangle
                size={24}
                style={{ color: 'var(--portal-error)', margin: '0 auto 0.75rem' }}
              />
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--portal-error)' }}>
                Upstream Broker Error (502 Bad Gateway)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
                Failed to reach Core HR service. Fallback error slot triggered.
              </div>
            </div>
          )}

          {/* SIMULATED STATE: DEFAULT (LIVE REPEATED ROWS) */}
          {simulatedState === 'default' && (
            <div
              style={{
                background: 'var(--portal-surface-elevated)',
                border: '1px solid var(--portal-border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr
                    style={{
                      background: 'var(--portal-surface)',
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
                      ID
                    </th>
                    <th
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'start',
                        color: 'var(--portal-text-secondary)',
                        fontWeight: 600,
                      }}
                    >
                      Employee Name
                    </th>
                    <th
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'start',
                        color: 'var(--portal-accent)',
                        fontWeight: 700,
                        background: 'rgba(59, 130, 246, 0.08)',
                      }}
                    >
                      Department (@.department.name)
                    </th>
                    <th
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'start',
                        color: 'var(--portal-text-secondary)',
                        fontWeight: 600,
                      }}
                    >
                      Job Title
                    </th>
                    <th
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'start',
                        color: 'var(--portal-text-secondary)',
                        fontWeight: 600,
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'start',
                        color: 'var(--portal-text-secondary)',
                        fontWeight: 600,
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rawEmployees.map((emp, index) => (
                    <tr
                      key={emp.id}
                      style={{
                        borderBottom: '1px solid var(--portal-border)',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <td
                        style={{
                          padding: '0.75rem 1rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--portal-text-muted)',
                        }}
                      >
                        {evaluatePath(mappings.id, emp)}
                      </td>
                      <td
                        style={{
                          padding: '0.75rem 1rem',
                          fontWeight: 600,
                          color: 'var(--portal-text-primary)',
                        }}
                      >
                        {evaluatePath(mappings.name, emp)}
                      </td>
                      <td
                        style={{ padding: '0.75rem 1rem', background: 'rgba(59, 130, 246, 0.04)' }}
                      >
                        <span
                          style={{
                            background: 'var(--portal-surface)',
                            border: '1px solid var(--portal-border-active)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--portal-accent)',
                          }}
                        >
                          {evaluatePath(mappings.department, emp)}
                        </span>
                      </td>
                      <td
                        style={{ padding: '0.75rem 1rem', color: 'var(--portal-text-secondary)' }}
                      >
                        {evaluatePath(mappings.jobTitle, emp)}
                      </td>
                      <td
                        style={{
                          padding: '0.75rem 1rem',
                          color: 'var(--portal-text-muted)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.725rem',
                        }}
                      >
                        {evaluatePath(mappings.email, emp)}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.725rem',
                            fontWeight: 600,
                            color: emp.active
                              ? 'var(--portal-success)'
                              : 'var(--portal-text-muted)',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: 'currentColor',
                            }}
                          ></span>
                          {evaluatePath(mappings.active, emp)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Binding JSON Manifest Preview */}
          <div
            style={{
              background: 'var(--portal-surface-elevated)',
              border: '1px solid var(--portal-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--portal-text-primary)',
                marginBottom: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Code size={14} style={{ color: 'var(--portal-accent)' }} /> Compiled Binding Manifest
            </div>
            <pre
              style={{
                background: 'var(--portal-surface)',
                border: '1px solid var(--portal-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--portal-text-secondary)',
                overflowX: 'auto',
              }}
            >
              {JSON.stringify(
                {
                  apiOperationId: 'op-core-hr-employees',
                  collectionPath: collectionPath,
                  totalPath: '$.total',
                  fieldMappings: mappings,
                },
                null,
                2,
              )}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
