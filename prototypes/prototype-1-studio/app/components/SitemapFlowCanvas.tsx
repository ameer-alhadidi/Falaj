'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  Handle,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  FileCode2,
  Folder,
  Home,
  Plus,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  ShieldCheck,
  Maximize2,
  ZoomIn,
  RefreshCw,
  Compass,
  ArrowRight,
  Info,
  CheckCircle2,
  X,
} from 'lucide-react';
import { SitemapNode, StudioPageDefinition } from '../../fixtures/sitemap';

// Custom Node Data Interface
export interface SitemapNodeData extends Record<string, unknown> {
  id: string;
  title: string;
  route: string;
  type: 'page' | 'folder';
  status: 'published' | 'draft' | 'archived';
  isHome?: boolean;
  requiredRole?: string;
  badge?: string;
  elementCount: number;
  isActive: boolean;
  onOpenDesigner: (pageId: string) => void;
  onDeleteNode: (pageId: string) => void;
}

// Custom React Flow Node Component
function CustomSitemapNode({ data, selected }: NodeProps<Node<SitemapNodeData>>) {
  const isHome = data.isHome;
  const isFolder = data.type === 'folder';
  const isActive = data.isActive;

  const statusColor =
    data.status === 'published'
      ? 'var(--portal-success, #10b981)'
      : data.status === 'draft'
      ? 'var(--portal-warning, #f59e0b)'
      : 'var(--portal-text-muted, #94a3b8)';

  return (
    <div
      style={{
        minWidth: '240px',
        maxWidth: '300px',
        background: 'var(--portal-surface, #1e293b)',
        border: selected
          ? '2px solid var(--portal-accent, #3b82f6)'
          : isActive
          ? '2px solid rgba(59, 130, 246, 0.6)'
          : '1px solid var(--portal-border, rgba(255, 255, 255, 0.1))',
        boxShadow: selected
          ? '0 0 0 4px rgba(59, 130, 246, 0.25), 0 10px 25px -5px rgba(0, 0, 0, 0.5)'
          : '0 4px 12px rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        overflow: 'hidden',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
      }}
      title="Double-click to open Page Designer"
    >
      {/* React Flow Handles for dynamic edge connections */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: 'var(--portal-accent, #3b82f6)',
          width: 8,
          height: 8,
          border: '2px solid var(--portal-surface, #1e293b)',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: 'var(--portal-accent, #3b82f6)',
          width: 8,
          height: 8,
          border: '2px solid var(--portal-surface, #1e293b)',
        }}
      />

      {/* Top Status Banner */}
      <div
        style={{
          height: '4px',
          background: isHome
            ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
            : isFolder
            ? '#8b5cf6'
            : statusColor,
          width: '100%',
        }}
      />

      {/* Node Header */}
      <div
        style={{
          padding: '0.75rem 0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: isHome
                  ? 'rgba(59, 130, 246, 0.2)'
                  : isFolder
                  ? 'rgba(139, 92, 246, 0.2)'
                  : 'rgba(255, 255, 255, 0.06)',
                color: isHome
                  ? 'var(--portal-accent, #3b82f6)'
                  : isFolder
                  ? '#a78bfa'
                  : 'var(--portal-text-primary, #f8fafc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isHome ? <Home size={14} /> : isFolder ? <Folder size={14} /> : <FileCode2 size={14} />}
            </div>
            <div>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  color: 'var(--portal-text-muted, #94a3b8)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2px 5px',
                  borderRadius: '4px',
                }}
              >
                {data.route}
              </span>
            </div>
          </div>

          {/* Quick Delete Action */}
          {!isHome && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onDeleteNode(data.id);
              }}
              title="Delete page node from sitemap"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--portal-text-muted, #94a3b8)',
                padding: '4px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ef4444';
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--portal-text-muted, #94a3b8)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        {/* Page Title */}
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--portal-text-primary, #f8fafc)',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {data.title}
        </div>

        {/* Badges / Metrics Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginTop: '2px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: statusColor,
              }}
            />
            <span
              style={{
                fontSize: '0.675rem',
                textTransform: 'capitalize',
                color: 'var(--portal-text-muted, #94a3b8)',
              }}
            >
              {data.status}
            </span>
          </div>

          <div
            style={{
              fontSize: '0.675rem',
              color: 'var(--portal-accent, #3b82f6)',
              background: 'rgba(59, 130, 246, 0.12)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <Layers size={11} />
            <span>{data.elementCount} elements</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div
        style={{
          borderTop: '1px solid var(--portal-border, rgba(255, 255, 255, 0.08))',
          background: 'rgba(0, 0, 0, 0.15)',
          padding: '0.4rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.65rem', color: 'var(--portal-text-muted, #94a3b8)' }}>
          Double-click to design
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onOpenDesigner(data.id);
          }}
          style={{
            background: 'var(--portal-accent, #3b82f6)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '3px 8px',
            fontSize: '0.675rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}
        >
          <span>Design</span>
          <ArrowRight size={10} />
        </button>
      </div>
    </div>
  );
}

// Props for SitemapFlowCanvas
export interface SitemapFlowCanvasProps {
  sitemapTree: SitemapNode[];
  pagesRegistry: Record<string, StudioPageDefinition>;
  activePageId: string;
  onSelectPage: (pageId: string) => void;
  onOpenPageDesigner: (pageId: string) => void;
  onAddPage: (page: { title: string; route: string; parentId?: string }) => void;
  onDeletePage: (pageId: string) => void;
  themeMode?: 'dark' | 'light';
}

export function SitemapFlowCanvas({
  sitemapTree,
  pagesRegistry,
  activePageId,
  onSelectPage,
  onOpenPageDesigner,
  onAddPage,
  onDeletePage,
  themeMode = 'dark',
}: SitemapFlowCanvasProps) {
  // Modal State for Adding Page Node
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newPageTitle, setNewPageTitle] = useState<string>('');
  const [newPageRoute, setNewPageRoute] = useState<string>('');
  const [newPageParentId, setNewPageParentId] = useState<string>('');

  // Selected Node in Flow
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(activePageId);

  // Register Custom Node Types
  const nodeTypes = useMemo(() => ({ sitemapNode: CustomSitemapNode }), []);

  // Compute Initial Nodes and Edges from Sitemap Tree
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node<SitemapNodeData>[] = [];
    const edges: Edge[] = [];

    let currentX = 80;
    const baseY = 120;
    const horizontalGap = 320;
    const verticalGap = 200;

    // Traverse tree recursively to generate layout coordinates
    const traverse = (nodeList: SitemapNode[], parentId?: string, depth = 0, offsetX = 80) => {
      let childX = offsetX;
      nodeList.forEach((item, index) => {
        const xPos = depth === 0 ? currentX : childX;
        const yPos = baseY + depth * verticalGap;

        // Calculate element count from pagesRegistry
        const pageDef = pagesRegistry[item.id];
        const elementCount =
          (pageDef?.pageNodes?.length || 0) + (pageDef?.formFields?.length || 0);

        nodes.push({
          id: item.id,
          type: 'sitemapNode',
          position: { x: xPos, y: yPos },
          data: {
            id: item.id,
            title: item.title,
            route: item.route,
            type: item.type,
            status: item.status,
            isHome: item.isHome,
            requiredRole: item.requiredRole,
            badge: item.badge,
            elementCount,
            isActive: item.id === activePageId,
            onOpenDesigner: onOpenPageDesigner,
            onDeleteNode: onDeletePage,
          },
        });

        if (parentId) {
          edges.push({
            id: `edge-${parentId}-${item.id}`,
            source: parentId,
            target: item.id,
            type: 'smoothstep',
            animated: true,
            style: { stroke: 'var(--portal-accent, #3b82f6)', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: 'var(--portal-accent, #3b82f6)',
              width: 16,
              height: 16,
            },
          });
        }

        if (item.children && item.children.length > 0) {
          traverse(item.children, item.id, depth + 1, xPos - 50);
        }

        if (depth === 0) {
          currentX += horizontalGap;
        } else {
          childX += 280;
        }
      });
    };

    traverse(sitemapTree);
    return { initialNodes: nodes, initialEdges: edges };
  }, [sitemapTree, pagesRegistry, activePageId, onOpenPageDesigner, onDeletePage]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state whenever sitemapTree, activePageId, or pagesRegistry updates
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Connect handler
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            style: { stroke: 'var(--portal-accent, #3b82f6)', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--portal-accent, #3b82f6)' },
          },
          eds,
        ),
      ),
    [setEdges],
  );

  // Double Click Node -> Immediately switch into Page Designer
  const handleNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onSelectPage(node.id);
      onOpenPageDesigner(node.id);
    },
    [onSelectPage, onOpenPageDesigner],
  );

  // Click Node -> Select it
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
      onSelectPage(node.id);
    },
    [onSelectPage],
  );

  // Handle Adding New Node
  const handleCreateNodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;

    let computedRoute = newPageRoute.trim();
    if (!computedRoute) {
      computedRoute =
        '/' +
        newPageTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
    }
    if (!computedRoute.startsWith('/')) {
      computedRoute = '/' + computedRoute;
    }

    onAddPage({
      title: newPageTitle.trim(),
      route: computedRoute,
      parentId: newPageParentId || undefined,
    });

    setNewPageTitle('');
    setNewPageRoute('');
    setNewPageParentId('');
    setShowAddModal(false);
  };

  // Handle Deleting Selected Node
  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    const targetNode = nodes.find((n) => n.id === selectedNodeId);
    if (targetNode?.data?.isHome) {
      alert('The root Home page node cannot be deleted.');
      return;
    }
    onDeletePage(selectedNodeId);
    setSelectedNodeId(null);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'var(--portal-bg, #0f172a)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Canvas Toolbar */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          right: '1rem',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        {/* Left Controls: Add Node & Delete */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--portal-surface, #1e293b)',
            border: '1px solid var(--portal-border, rgba(255, 255, 255, 0.1))',
            borderRadius: '8px',
            padding: '6px 10px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              paddingRight: '8px',
              borderRight: '1px solid var(--portal-border, rgba(255, 255, 255, 0.1))',
            }}
          >
            <Compass size={16} style={{ color: 'var(--portal-accent, #3b82f6)' }} />
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--portal-text-primary, #f8fafc)',
              }}
            >
              Sitemap Flow
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                background: 'rgba(59, 130, 246, 0.15)',
                color: 'var(--portal-accent, #3b82f6)',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 600,
              }}
            >
              React Flow
            </span>
          </div>

          <button
            id="btn-flow-add-node"
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'var(--portal-accent, #3b82f6)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'opacity 0.15s',
            }}
          >
            <Plus size={14} />
            <span>Add Page Node</span>
          </button>

          {selectedNodeId && (
            <button
              id="btn-flow-delete-node"
              onClick={handleDeleteSelected}
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Trash2 size={13} />
              <span>Delete Node</span>
            </button>
          )}
        </div>

        {/* Right Info Pill */}
        <div
          style={{
            background: 'var(--portal-surface, #1e293b)',
            border: '1px solid var(--portal-border, rgba(255, 255, 255, 0.1))',
            borderRadius: '8px',
            padding: '6px 12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.725rem',
            color: 'var(--portal-text-muted, #94a3b8)',
            pointerEvents: 'auto',
          }}
        >
          <Info size={13} style={{ color: 'var(--portal-accent, #3b82f6)' }} />
          <span>Double-click any node to open the Page Designer & add elements</span>
        </div>
      </div>

      {/* React Flow Core Canvas */}
      <div style={{ flex: 1, width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Background
            color={themeMode === 'dark' ? '#334155' : '#cbd5e1'}
            gap={20}
            size={1.5}
          />
          <Controls
            style={{
              background: 'var(--portal-surface, #1e293b)',
              border: '1px solid var(--portal-border, rgba(255, 255, 255, 0.1))',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          />
          <MiniMap
            nodeColor={(node) => {
              if (node.data?.isHome) return '#3b82f6';
              if (node.data?.type === 'folder') return '#8b5cf6';
              return '#10b981';
            }}
            style={{
              background: 'var(--portal-surface, #1e293b)',
              border: '1px solid var(--portal-border, rgba(255, 255, 255, 0.1))',
              borderRadius: '8px',
            }}
          />
        </ReactFlow>
      </div>

      {/* Add Page Node Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: 'var(--portal-surface, #1e293b)',
              border: '1px solid var(--portal-border, rgba(255, 255, 255, 0.15))',
              borderRadius: '12px',
              padding: '1.5rem',
              width: '420px',
              maxWidth: '90vw',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} style={{ color: 'var(--portal-accent, #3b82f6)' }} />
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--portal-text-primary, #f8fafc)',
                  }}
                >
                  Add Sitemap Page Node
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--portal-text-muted, #94a3b8)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreateNodeSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
            >
              <div>
                <label
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--portal-text-secondary, #cbd5e1)',
                    marginBottom: '4px',
                    display: 'block',
                  }}
                >
                  Page Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Products & Catalog"
                  value={newPageTitle}
                  onChange={(e) => {
                    setNewPageTitle(e.target.value);
                    if (!newPageRoute) {
                      setNewPageRoute(
                        '/' +
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, ''),
                      );
                    }
                  }}
                  style={{
                    width: '100%',
                    background: 'var(--portal-surface-elevated, #0f172a)',
                    border: '1px solid var(--portal-border, rgba(255, 255, 255, 0.15))',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    fontSize: '0.85rem',
                    color: 'var(--portal-text-primary, #f8fafc)',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--portal-text-secondary, #cbd5e1)',
                    marginBottom: '4px',
                    display: 'block',
                  }}
                >
                  URL Route Path *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /products"
                  value={newPageRoute}
                  onChange={(e) => setNewPageRoute(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--portal-surface-elevated, #0f172a)',
                    border: '1px solid var(--portal-border, rgba(255, 255, 255, 0.15))',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono, monospace)',
                    color: 'var(--portal-accent, #3b82f6)',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--portal-text-secondary, #cbd5e1)',
                    marginBottom: '4px',
                    display: 'block',
                  }}
                >
                  Parent Node (Optional Hierarchy)
                </label>
                <select
                  value={newPageParentId}
                  onChange={(e) => setNewPageParentId(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--portal-surface-elevated, #0f172a)',
                    border: '1px solid var(--portal-border, rgba(255, 255, 255, 0.15))',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    fontSize: '0.85rem',
                    color: 'var(--portal-text-primary, #f8fafc)',
                  }}
                >
                  <option value="">None (Top-Level Page)</option>
                  {sitemapTree.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.title} ({node.route})
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  marginTop: '0.75rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--portal-border, rgba(255, 255, 255, 0.15))',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    color: 'var(--portal-text-secondary, #cbd5e1)',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'var(--portal-accent, #3b82f6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Create & Place Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
