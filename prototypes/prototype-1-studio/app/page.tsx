'use client';

import React, { useState, useEffect } from 'react';
import initialEmployees from '../fixtures/employees.json';
import initialPageData from '../fixtures/page-nodes.json';
import { COMPLETE_HERO_UI_CATALOG, HeroUIComponentItem } from '../fixtures/heroui-catalog';
import {
  INITIAL_SITEMAP_TREE,
  INITIAL_PAGES_REGISTRY,
  SitemapNode,
  StudioPageDefinition,
} from '../fixtures/sitemap';
import {
  Layers,
  LayoutGrid,
  Box,
  Heading,
  Type,
  Table as TableIcon,
  MousePointer,
  RotateCcw,
  RotateCw,
  Eye,
  EyeOff,
  Send,
  Moon,
  Sun,
  Laptop,
  Tablet,
  Smartphone,
  FolderTree,
  Folder,
  FolderOpen,
  File,
  FileCode,
  Lock,
  Plus,
  Trash2,
  Copy,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Database,
  Sliders,
  CheckCircle2,
  Globe,
  Sparkles,
  Link as LinkIcon,
  Component,
  Search,
  ShieldCheck,
  AlertCircle,
  Calendar as CalendarIcon,
  Users,
  Minus,
  Check,
  X,
  FileText,
  FormInput,
  CheckSquare,
  GripVertical,
  Code2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Move,
  Play,
  Palette,
  Clock,
  Key,
  Radio,
  ToggleLeft,
  SlidersHorizontal,
  Loader2,
  Gauge,
  Tag,
  List,
  MessageSquare,
  Maximize2,
} from 'lucide-react';

type Viewport = 'desktop' | 'tablet' | 'mobile';
type ThemeMode = 'dark' | 'light';
type Direction = 'ltr' | 'rtl';
type InspectorTab = 'properties' | 'grid' | 'binding' | 'permissions';
type CanvasSectionKey = 'header' | 'form' | 'table';

// Initial Seed Form Fields
const INITIAL_FORM_FIELDS = [
  {
    id: 'node-field-fullname',
    type: 'Input',
    schemaVersion: 1,
    layout: { colStart: 1, colSpan: 6 },
    props: {
      label: 'Full Name',
      placeholder: 'e.g. Sarah Jenkins',
      required: true,
    },
    binding: {
      field: 'fullName',
      path: '$.data.employee.fullName',
      operation: 'POST /api/employees',
      validation: 'required',
    },
  },
  {
    id: 'node-field-dept',
    type: 'Select',
    schemaVersion: 1,
    layout: { colStart: 7, colSpan: 6 },
    props: {
      label: 'Department',
      options: ['Engineering', 'Finance', 'Human Resources', 'Operations'],
      required: true,
    },
    binding: {
      field: 'departmentId',
      path: '$.data.employee.departmentId',
      operation: 'POST /api/employees',
      validation: 'required',
    },
  },
  {
    id: 'node-field-hiredate',
    type: 'DateRangePicker',
    schemaVersion: 1,
    layout: { colStart: 1, colSpan: 6 },
    props: {
      label: 'Employment Contract Period',
      placeholder: 'dd / mm / yyyy – dd / mm / yyyy',
    },
    binding: {
      field: 'contractPeriod',
      path: '$.data.employee.contractPeriod',
      operation: 'POST /api/employees',
      validation: 'iso8601-range',
    },
  },
  {
    id: 'node-field-security',
    type: 'Checkbox',
    schemaVersion: 1,
    layout: { colStart: 7, colSpan: 6 },
    props: {
      label: 'Grant corporate VPN and production cluster access',
      checked: true,
    },
    binding: {
      field: 'hasVpnAccess',
      path: '$.data.employee.security.vpn',
      operation: 'POST /api/employees',
    },
  },
  {
    id: 'node-field-compliance-accordion',
    type: 'Accordion',
    schemaVersion: 1,
    layout: { colStart: 1, colSpan: 12 },
    props: {
      variant: 'surface',
      hideSeparator: false,
      allowsMultipleExpanded: false,
      isDisabled: false,
      align: 'center',
      maxWidth: '640px',
      titleAlign: 'start',
      dataSource: 'static',
      apiEndpoint: '/api/accordion-items',
      dataPath: '$.data',
      items: [
        {
          id: 'item-1',
          title: 'Security Clearance & Background Check',
          content:
            'Dual-approval required for root access. Background verification logged in audit registry.',
          icon: 'ShieldCheck',
        },
        {
          id: 'item-2',
          title: 'Employment Terms & Compliance Agreement',
          content:
            'Standard enterprise non-disclosure agreement, intellectual property assignment, and automated compliance provisions apply.',
          icon: 'FileText',
        },
        {
          id: 'item-3',
          title: 'Access Roles & Permissions Matrix',
          content:
            'Granular RBAC privileges enforced by OpenPolicyAgent with least-privilege delegation and multi-factor approval requirements.',
          icon: 'Lock',
        },
      ],
    },
    binding: {
      field: 'complianceStatus',
      path: '$.data.employee.compliance',
      operation: 'POST /api/employees',
    },
  },
  {
    id: 'node-field-submit',
    type: 'Button',
    schemaVersion: 1,
    layout: { colStart: 1, colSpan: 12 },
    props: {
      label: 'Save & Dispatch Record',
      variant: 'primary',
      isSubmit: true,
    },
    binding: {
      field: 'submitAction',
      path: '$.action.submit',
      operation: 'POST /api/employees',
    },
  },
];

export default function StudioPage() {
  // Studio Mode: Design Mode vs Live Preview Mode
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Viewport, Theme & Layout
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'Saved' | 'Unsaved changes'>('Saved');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-field-compliance-accordion');
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('properties');

  // Canvas Top-Level Section Order
  const [sectionOrder, setSectionOrder] = useState<CanvasSectionKey[]>(['header', 'form', 'table']);

  // Move / Reorder States
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
  const [dragOverFieldId, setDragOverFieldId] = useState<string | null>(null);
  const [dropIndicatorSide, setDropIndicatorSide] = useState<'before' | 'after'>('after');

  // HeroUI Drawer & Filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [draggedComponentType, setDraggedComponentType] = useState<string | null>(null);
  const [isDropOverForm, setIsDropOverForm] = useState<boolean>(false);

  // Live Interactive Preview State for Form Inputs
  const [liveFormValues, setLiveFormValues] = useState<Record<string, any>>({
    'node-field-fullname': 'Sarah Jenkins',
    'node-field-dept': 'Engineering',
    'node-field-hiredate': '2026-11-01',
    'node-field-security': true,
  });
  const [submittedPreviewData, setSubmittedPreviewData] = useState<any | null>(null);

  // Accordion State Management (Data Source & API Sync)
  const [accordionApiStatus, setAccordionApiStatus] = useState<string>('');
  const [accordionJsonDraft, setAccordionJsonDraft] = useState<string>('');
  const [accordionJsonError, setAccordionJsonError] = useState<string | null>(null);

  const handleFetchAccordionApi = async (fieldId: string, endpoint: string, dataPath?: string) => {
    setAccordionApiStatus('Loading API data...');
    try {
      const res = await fetch(endpoint || '/api/accordion-items');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      let extracted: any = json;
      if (dataPath) {
        const cleanPath = dataPath.replace(/^\$\./, '').split('.');
        for (const p of cleanPath) {
          if (p && extracted && extracted[p] !== undefined) {
            extracted = extracted[p];
          }
        }
      }
      if (Array.isArray(extracted)) {
        updateNodeProperty('items', extracted);
        const detectedKeys =
          extracted.length > 0 && typeof extracted[0] === 'object' && extracted[0] !== null
            ? Object.keys(extracted[0])
            : [];
        setLiveFormValues((prev) => ({
          ...prev,
          [fieldId + '_api_data']: extracted,
          [fieldId + '_api_status']: `Synced (${extracted.length} items)`,
          [fieldId + '_available_keys']: detectedKeys,
        }));
        setAccordionApiStatus(`Success: ${extracted.length} items loaded`);
      } else {
        throw new Error('API response data is not an array of items');
      }
    } catch (err: any) {
      setAccordionApiStatus(`Error: ${err.message}`);
    }
  };

  // 3-Tier Persona: Administrator Governance State for all 72 components
  const [showAdminGovernanceModal, setShowAdminGovernanceModal] = useState<boolean>(false);
  const [adminAllowedComponents, setAdminAllowedComponents] = useState<Record<string, boolean>>(
    () => {
      const initialAllowed: Record<string, boolean> = {};
      COMPLETE_HERO_UI_CATALOG.forEach((c) => {
        initialAllowed[c.type] = true;
      });
      return initialAllowed;
    },
  );

  // Multi-Page & Sitemap State
  const [sitemapTree, setSitemapTree] = useState<SitemapNode[]>(INITIAL_SITEMAP_TREE);
  const [pagesRegistry, setPagesRegistry] =
    useState<Record<string, StudioPageDefinition>>(INITIAL_PAGES_REGISTRY);
  const [activePageId, setActivePageId] = useState<string>('page-managers-01');
  const [leftPanelTab, setLeftPanelTab] = useState<'sitemap' | 'components'>('sitemap');
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [showNewPageModal, setShowNewPageModal] = useState<boolean>(false);
  const [newPageTitle, setNewPageTitle] = useState<string>('');
  const [newPageRoute, setNewPageRoute] = useState<string>('');

  // Page Nodes State
  const [formFields, setFormFields] = useState<any[]>(INITIAL_FORM_FIELDS);
  const [pageNodes, setPageNodes] = useState(initialPageData.nodes);
  const [employees, setEmployees] = useState(initialEmployees.data);

  // Handle Page Switching from Sitemap Tree or Top Bar Dropdown
  const handleSelectPage = (targetPageId: string) => {
    if (targetPageId === activePageId) return;

    // Snapshot current active page into registry before switching
    setPagesRegistry((prev) => ({
      ...prev,
      [activePageId]: {
        ...prev[activePageId],
        pageNodes: JSON.parse(JSON.stringify(pageNodes)),
        formFields: JSON.parse(JSON.stringify(formFields)),
        sectionOrder: [...sectionOrder],
      },
    }));

    const targetPage = pagesRegistry[targetPageId];
    if (!targetPage) return;

    setActivePageId(targetPageId);
    setPageNodes(targetPage.pageNodes || []);
    setFormFields(targetPage.formFields || []);
    setSectionOrder(targetPage.sectionOrder || ['header', 'form']);

    if (targetPage.formFields && targetPage.formFields.length > 0) {
      setSelectedNodeId(targetPage.formFields[0].id);
    } else {
      setSelectedNodeId('node-header-title');
    }
    setSaveStatus('Saved');
    setUndoStack([]);
    setRedoStack([]);
  };

  // Handle Creating New Page in Sitemap
  const handleCreateNewPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;
    const formattedRoute = newPageRoute.startsWith('/')
      ? newPageRoute.trim()
      : '/' + newPageRoute.trim().toLowerCase().replace(/\s+/g, '-');
    const newId = 'page-' + Math.random().toString(36).substring(2, 9);

    const newPageDef: StudioPageDefinition = {
      pageId: newId,
      title: newPageTitle.trim(),
      route: formattedRoute,
      description: `Custom layout and components for ${newPageTitle.trim()}`,
      requiredPermissions: [],
      version: 1,
      sectionOrder: ['header', 'form'],
      pageNodes: [
        {
          id: 'node-root-container',
          type: 'Container',
          schemaVersion: 1,
          layout: { colStart: 1, colSpan: 12 },
          props: { padding: 'var(--space-6)', background: 'transparent' },
          children: [
            {
              id: 'node-page-header',
              type: 'Section',
              schemaVersion: 1,
              layout: { colStart: 1, colSpan: 12 },
              props: { spacing: 'var(--space-4)' },
              children: [
                {
                  id: 'node-header-title',
                  type: 'Heading',
                  schemaVersion: 1,
                  layout: { colStart: 1, colSpan: 8 },
                  props: { level: 1, text: newPageTitle.trim(), align: 'start' },
                },
                {
                  id: 'node-header-desc',
                  type: 'Text',
                  schemaVersion: 1,
                  layout: { colStart: 1, colSpan: 8 },
                  props: {
                    content: `Visual canvas for ${formattedRoute}. Use the HeroUI Toolbox to drag-and-drop components.`,
                    variant: 'muted',
                  },
                },
              ],
            },
          ],
        },
      ],
      formFields: [],
    };

    const newSitemapNode: SitemapNode = {
      id: newId,
      title: newPageTitle.trim(),
      route: formattedRoute,
      type: 'page',
      status: 'draft',
      badge: 'New',
    };

    setPagesRegistry((prev) => ({ ...prev, [newId]: newPageDef }));
    setSitemapTree((prev) => [...prev, newSitemapNode]);
    setShowNewPageModal(false);
    setNewPageTitle('');
    setNewPageRoute('');
    handleSelectPage(newId);
  };

  // Undo/Redo Stacks
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  // Apply Theme & Direction to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    localStorage.setItem('visual-platform-theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
  }, [direction]);

  // Global Keyboard Shortcuts (Esc to exit preview or close modal, P to toggle preview)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAdminGovernanceModal) {
          setShowAdminGovernanceModal(false);
        } else if (isPreviewMode) {
          setIsPreviewMode(false);
        }
      } else if (
        (e.key === 'p' || e.key === 'P') &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        setIsPreviewMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode, showAdminGovernanceModal]);

  // Helper to find selected node
  const findNode = (nodes: any[], id: string): any => {
    const foundInForm = formFields.find((f) => f.id === id);
    if (foundInForm) return foundInForm;

    if (id === 'node-manager-form') {
      return {
        id: 'node-manager-form',
        type: 'Form',
        layout: { colStart: 1, colSpan: 12 },
        props: {
          title: 'Employee Onboarding & Registration Form',
          subtitle:
            'Drop HeroUI form components here for builder assembly and developer data-binding.',
        },
        binding: {
          operation: 'POST /api/employees',
          targetPayload: '$.data.employee',
        },
      };
    }

    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode =
    findNode(pageNodes, selectedNodeId) || formFields.find((f) => f.id === selectedNodeId) || null;

  // Push to Undo Stack Helper
  const pushUndoSnapshot = () => {
    setUndoStack((prev) => [
      ...prev,
      {
        pageNodes: JSON.parse(JSON.stringify(pageNodes)),
        formFields: [...formFields],
        sectionOrder: [...sectionOrder],
      },
    ]);
    setRedoStack([]);
    setSaveStatus('Unsaved changes');
  };

  // Update Node Property
  const updateNodeProperty = (key: string, value: any) => {
    pushUndoSnapshot();

    if (formFields.some((f) => f.id === selectedNodeId)) {
      setFormFields((prev) =>
        prev.map((f) => {
          if (f.id === selectedNodeId) {
            return { ...f, props: { ...f.props, [key]: value } };
          }
          return f;
        }),
      );
      return;
    }

    const updateRecursive = (nodes: any[]): any[] => {
      return nodes.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            props: { ...node.props, [key]: value },
          };
        }
        if (node.children) {
          return { ...node, children: updateRecursive(node.children) };
        }
        return node;
      });
    };

    setPageNodes(updateRecursive(pageNodes));
  };

  // Update Node Layout (Grid ColSpan, ColStart)
  const updateNodeLayout = (key: string, value: any) => {
    pushUndoSnapshot();

    if (formFields.some((f) => f.id === selectedNodeId)) {
      setFormFields((prev) =>
        prev.map((f) => {
          if (f.id === selectedNodeId) {
            return { ...f, layout: { ...f.layout, [key]: Number(value) } };
          }
          return f;
        }),
      );
      return;
    }

    const updateRecursive = (nodes: any[]): any[] => {
      return nodes.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            layout: { ...node.layout, [key]: Number(value) },
          };
        }
        if (node.children) {
          return { ...node, children: updateRecursive(node.children) };
        }
        return node;
      });
    };

    setPageNodes(updateRecursive(pageNodes));
  };

  // Update Node Data-Binding
  const updateNodeBinding = (key: string, value: any) => {
    pushUndoSnapshot();

    if (formFields.some((f) => f.id === selectedNodeId)) {
      setFormFields((prev) =>
        prev.map((f) => {
          if (f.id === selectedNodeId) {
            return { ...f, binding: { ...f.binding, [key]: value } };
          }
          return f;
        }),
      );
    }
  };

  // Move Form Field in Sequence
  const moveFormField = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= formFields.length) return;
    pushUndoSnapshot();

    const updated = [...formFields];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setFormFields(updated);
  };

  // Reorder Form Fields via Drag and Drop
  const handleReorderFormField = (sourceId: string, targetId: string, side: 'before' | 'after') => {
    if (sourceId === targetId) return;
    const sourceIndex = formFields.findIndex((f) => f.id === sourceId);
    if (sourceIndex === -1) return;

    pushUndoSnapshot();

    const updated = [...formFields];
    const [moved] = updated.splice(sourceIndex, 1);
    const newTargetIndex = updated.findIndex((f) => f.id === targetId);
    const insertIndex = side === 'before' ? newTargetIndex : newTargetIndex + 1;
    updated.splice(insertIndex, 0, moved);

    setFormFields(updated);
  };

  // Move Section Up or Down on Canvas
  const moveCanvasSection = (sectionKey: CanvasSectionKey, dir: 'up' | 'down') => {
    const currentIndex = sectionOrder.indexOf(sectionKey);
    if (dir === 'up' && currentIndex > 0) {
      pushUndoSnapshot();
      const next = [...sectionOrder];
      [next[currentIndex - 1], next[currentIndex]] = [next[currentIndex], next[currentIndex - 1]];
      setSectionOrder(next);
    } else if (dir === 'down' && currentIndex < sectionOrder.length - 1) {
      pushUndoSnapshot();
      const next = [...sectionOrder];
      [next[currentIndex + 1], next[currentIndex]] = [next[currentIndex], next[currentIndex + 1]];
      setSectionOrder(next);
    }
  };

  // Remove Section from Canvas
  const removeCanvasSection = (sectionKey: CanvasSectionKey) => {
    pushUndoSnapshot();
    setSectionOrder((prev) => prev.filter((k) => k !== sectionKey));
    if (sectionKey === 'table' && selectedNodeId === 'node-employee-table') {
      setSelectedNodeId('node-manager-form');
    } else if (
      sectionKey === 'form' &&
      (selectedNodeId === 'node-manager-form' || formFields.some((f) => f.id === selectedNodeId))
    ) {
      setSelectedNodeId('node-header-title');
    } else if (sectionKey === 'header' && selectedNodeId === 'node-header-title') {
      setSelectedNodeId('node-manager-form');
    }
  };

  // Restore Section to Canvas
  const restoreCanvasSection = (sectionKey: CanvasSectionKey) => {
    pushUndoSnapshot();
    if (!sectionOrder.includes(sectionKey)) {
      setSectionOrder((prev) => [...prev, sectionKey]);
    }
    if (sectionKey === 'table') setSelectedNodeId('node-employee-table');
    if (sectionKey === 'form') setSelectedNodeId('node-manager-form');
    if (sectionKey === 'header') setSelectedNodeId('node-header-title');
  };

  // Drop Component into Form (Builder Tier)
  const handleDropComponentIntoForm = (componentType: string) => {
    if (!adminAllowedComponents[componentType]) {
      alert(
        `[Admin Governance Restriction]: "${componentType}" is currently disabled by the Administrator. Enable it in Admin Governance to place it on the canvas.`,
      );
      return;
    }

    // If Table component is selected and Table section was removed, restore it directly
    if (componentType === 'Table' && !sectionOrder.includes('table')) {
      restoreCanvasSection('table');
      return;
    }

    const catalogItem = COMPLETE_HERO_UI_CATALOG.find((c) => c.type === componentType);
    if (!catalogItem) return;

    const newId = `node-form-${componentType.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const newFieldNode = {
      id: newId,
      type: catalogItem.type,
      schemaVersion: 1,
      layout: {
        colStart: 1,
        colSpan: catalogItem.defaultLayout.colSpan,
      },
      props: { ...catalogItem.defaultProps },
      binding: { ...catalogItem.defaultBinding },
    };

    pushUndoSnapshot();
    setFormFields((prev) => [...prev, newFieldNode]);
    setSelectedNodeId(newId);
  };

  // Delete Form Component
  const handleDeleteFormField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    pushUndoSnapshot();
    setFormFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedNodeId === id) {
      setSelectedNodeId('node-manager-form');
    }
  };

  // Undo / Redo Actions
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [
      ...prev,
      {
        pageNodes: JSON.parse(JSON.stringify(pageNodes)),
        formFields: [...formFields],
        sectionOrder: [...sectionOrder],
      },
    ]);
    setUndoStack((prev) => prev.slice(0, -1));
    if (previous.pageNodes) setPageNodes(previous.pageNodes);
    if (previous.formFields) setFormFields(previous.formFields);
    if (previous.sectionOrder) setSectionOrder(previous.sectionOrder);
    setSaveStatus('Unsaved changes');
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [
      ...prev,
      {
        pageNodes: JSON.parse(JSON.stringify(pageNodes)),
        formFields: [...formFields],
        sectionOrder: [...sectionOrder],
      },
    ]);
    setRedoStack((prev) => prev.slice(0, -1));
    if (next.pageNodes) setPageNodes(next.pageNodes);
    if (next.formFields) setFormFields(next.formFields);
    if (next.sectionOrder) setSectionOrder(next.sectionOrder);
    setSaveStatus('Unsaved changes');
  };

  // Handle Live Form Submit in Preview Mode
  const handleLiveFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      operation: 'POST /api/employees',
      timestamp: new Date().toISOString(),
      employee: {
        fullName: liveFormValues['node-field-fullname'] || 'Sarah Jenkins',
        departmentId: liveFormValues['node-field-dept'] || 'Engineering',
        startDate: liveFormValues['node-field-hiredate'] || '2026-11-01',
        hasVpnAccess: liveFormValues['node-field-security'] ?? true,
      },
    };
    setSubmittedPreviewData(payload);
  };

  // Filter Catalog
  const filteredCatalog = COMPLETE_HERO_UI_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoriesPresent = Array.from(new Set(filteredCatalog.map((c) => c.category)));

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return '390px';
      case 'tablet':
        return '768px';
      case 'desktop':
        return '100%';
    }
  };

  const allowedCount = Object.values(adminAllowedComponents).filter(Boolean).length;
  const totalCount = COMPLETE_HERO_UI_CATALOG.length;

  // Render a node in the Sitemap Hierarchy Tree
  const renderSitemapNode = (node: SitemapNode, depth = 0) => {
    const isFolder = node.type === 'folder';
    const isCollapsed = !!collapsedFolders[node.id];
    const isActive = node.id === activePageId;

    return (
      <div key={node.id} style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          id={`sitemap-node-${node.id}`}
          onClick={() => {
            if (isFolder) {
              setCollapsedFolders((prev) => ({ ...prev, [node.id]: !prev[node.id] }));
            } else {
              handleSelectPage(node.id);
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 10px',
            paddingInlineStart: `${10 + depth * 14}px`,
            borderRadius: 'var(--radius-sm)',
            background: isActive ? 'rgba(59, 130, 246, 0.14)' : 'transparent',
            border: isActive ? '1px solid var(--portal-accent)' : '1px solid transparent',
            borderInlineStart: isActive
              ? '3px solid var(--portal-accent)'
              : '1px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            color: isActive ? 'var(--portal-accent)' : 'var(--portal-text-primary)',
          }}
          onMouseEnter={(e) => {
            if (!isActive) e.currentTarget.style.background = 'var(--portal-surface-hover)';
          }}
          onMouseLeave={(e) => {
            if (!isActive) e.currentTarget.style.background = 'transparent';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
            {isFolder ? (
              <span
                style={{
                  color: 'var(--portal-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
              </span>
            ) : (
              <span style={{ width: '13px', display: 'inline-block' }} />
            )}

            {isFolder ? (
              isCollapsed ? (
                <Folder size={14} style={{ color: '#f59e0b', flexShrink: 0 }} />
              ) : (
                <FolderOpen size={14} style={{ color: '#f59e0b', flexShrink: 0 }} />
              )
            ) : node.isHome ? (
              <Globe size={14} style={{ color: 'var(--portal-accent)', flexShrink: 0 }} />
            ) : (
              <FileText
                size={14}
                style={{
                  color: isActive ? 'var(--portal-accent)' : 'var(--portal-text-secondary)',
                  flexShrink: 0,
                }}
              />
            )}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              <span
                style={{
                  fontSize: '0.775rem',
                  fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {node.title}
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--portal-text-muted)',
                }}
              >
                {node.route}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            {node.requiredRole && (
              <span
                title={`Requires role: ${node.requiredRole}`}
                style={{ color: 'var(--portal-text-muted)' }}
              >
                <Lock size={10} />
              </span>
            )}
            {node.status && (
              <span
                style={{
                  fontSize: '0.6rem',
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  background:
                    node.status === 'published'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(245, 158, 11, 0.15)',
                  color:
                    node.status === 'published' ? 'var(--portal-success)' : 'var(--portal-warning)',
                }}
              >
                {node.status}
              </span>
            )}
            {node.badge && (
              <span
                style={{
                  fontSize: '0.6rem',
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#8b5cf6',
                }}
              >
                {node.badge}
              </span>
            )}
          </div>
        </div>

        {/* Children if folder and not collapsed */}
        {isFolder && !isCollapsed && node.children && (
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px' }}>
            {node.children.map((child) => renderSitemapNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
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
          background: isPreviewMode ? 'var(--portal-surface-elevated)' : 'var(--portal-surface)',
          borderBottom: `1px solid ${isPreviewMode ? 'var(--portal-accent)' : 'var(--portal-border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          zIndex: 50,
          transition: 'all 0.2s ease',
        }}
      >
        {/* Left: Project Branding & Mode Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: isPreviewMode
                ? 'linear-gradient(135deg, var(--portal-success), #10b981)'
                : 'linear-gradient(135deg, var(--portal-accent), #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: isPreviewMode
                ? '0 2px 8px rgba(16, 185, 129, 0.4)'
                : '0 2px 6px rgba(59, 130, 246, 0.3)',
            }}
          >
            {isPreviewMode ? <Play size={16} fill="#fff" /> : 'V'}
          </div>
          <div>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--portal-text-primary)',
              }}
            >
              <span>Enterprise Visual Platform</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: isPreviewMode
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(59, 130, 246, 0.15)',
                  color: isPreviewMode ? 'var(--portal-success)' : 'var(--portal-accent)',
                  fontWeight: 700,
                }}
              >
                {isPreviewMode
                  ? 'Interactive Preview Mode'
                  : `Phase 3 Studio (${totalCount} HeroUI v3 Components)`}
              </span>
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--portal-text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <span>Project: Falaj Enterprise HR</span>
              <span>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: 'var(--portal-text-secondary)', fontWeight: 600 }}>
                  Page:
                </span>
                <select
                  id="select-active-page-topbar"
                  value={activePageId}
                  onChange={(e) => handleSelectPage(e.target.value)}
                  style={{
                    background: 'var(--portal-surface-elevated)',
                    border: '1px solid var(--portal-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '2px 8px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: 'var(--portal-accent)',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="page-managers-01">📄 /managers — Personnel & Directory</option>
                  <option value="page-onboarding-02">📄 /onboarding — Employee Onboarding</option>
                  <option value="page-compliance-03">📄 /compliance — Security & Compliance</option>
                  <option value="page-roles-04">📄 /admin/roles — Roles & RBAC Matrix</option>
                </select>
              </div>
              <span>•</span>
              <span
                style={{
                  color: saveStatus === 'Saved' ? 'var(--portal-success)' : 'var(--portal-warning)',
                }}
              >
                {saveStatus}
              </span>
              <span>•</span>
              <span
                style={{
                  fontSize: '0.625rem',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#a78bfa',
                  fontWeight: 600,
                }}
              >
                Adapter: HeroUI v3
              </span>
            </div>
          </div>
        </div>

        {/* Center: Viewport Controls, Undo/Redo & Admin Governance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {!isPreviewMode && (
            <div
              style={{
                display: 'flex',
                background: 'var(--portal-surface-elevated)',
                border: '1px solid var(--portal-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '2px',
              }}
            >
              <button
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                title="Undo (Ctrl+Z)"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color:
                    undoStack.length > 0
                      ? 'var(--portal-text-primary)'
                      : 'var(--portal-text-muted)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: undoStack.length > 0 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                title="Redo (Ctrl+Y)"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color:
                    redoStack.length > 0
                      ? 'var(--portal-text-primary)'
                      : 'var(--portal-text-muted)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: redoStack.length > 0 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <RotateCw size={14} />
              </button>
            </div>
          )}

          {!isPreviewMode && (
            <button
              onClick={() => setShowGrid(!showGrid)}
              title="Toggle 12-Column Canvas Guides"
              style={{
                background: showGrid
                  ? 'var(--portal-surface-hover)'
                  : 'var(--portal-surface-elevated)',
                border: `1px solid ${showGrid ? 'var(--portal-border-active)' : 'var(--portal-border)'}`,
                color: showGrid ? 'var(--portal-accent)' : 'var(--portal-text-secondary)',
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
              <LayoutGrid size={14} /> Guides
            </button>
          )}

          {!isPreviewMode && (
            <button
              onClick={() => setShowAdminGovernanceModal(true)}
              title="Configure allowed project components as Administrator"
              style={{
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.12))',
                border: '1px solid var(--portal-success)',
                color: 'var(--portal-text-primary)',
                padding: '5px 11px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ShieldCheck size={14} style={{ color: 'var(--portal-success)' }} />
              <span>Admin Governance</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  background: 'var(--portal-success)',
                  color: '#fff',
                  padding: '1px 5px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {allowedCount}/{totalCount}
              </span>
            </button>
          )}
        </div>

        {/* Right Actions: Icons Only with Tooltips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {/* PREVIEW MODE TOGGLE */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            title={isPreviewMode ? 'Exit Preview Mode (Esc)' : 'Enter Live Preview Mode (P)'}
            style={{
              background: isPreviewMode
                ? 'var(--portal-accent)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
              border: isPreviewMode
                ? '1px solid var(--portal-accent)'
                : '1px solid var(--portal-border-active)',
              color: isPreviewMode ? '#fff' : 'var(--portal-accent)',
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isPreviewMode
                ? '0 2px 10px rgba(59, 130, 246, 0.4)'
                : '0 2px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.15s ease',
            }}
          >
            {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

          {/* RTL / LTR Toggle */}
          <button
            onClick={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')}
            title={
              direction === 'ltr' ? 'Switch to RTL (Arabic / العربية)' : 'Switch to LTR (English)'
            }
            style={{
              background: 'var(--portal-surface-elevated)',
              border: '1px solid var(--portal-border)',
              color: 'var(--portal-text-primary)',
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            <Globe size={16} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              background: 'var(--portal-surface-elevated)',
              border: '1px solid var(--portal-border)',
              color: 'var(--portal-text-primary)',
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            {themeMode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {!isPreviewMode && (
            <button
              onClick={() => {
                setSaveStatus('Saved');
                alert(
                  `Page published successfully to https://hr-portal.sites.example.com/managers (Release Manifest #105 generated with ${totalCount} HeroUI v3 nodes)`,
                );
              }}
              title={`Publish Page (${totalCount} HeroUI v3 Components)`}
              style={{
                background: 'var(--portal-accent)',
                color: 'var(--portal-accent-foreground)',
                border: 'none',
                padding: '6px 9px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              <Send size={15} />
            </button>
          )}
        </div>
      </header>

      {/* Preview Mode Floating Banner */}
      {isPreviewMode && (
        <div
          style={{
            background:
              'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))',
            borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '6px 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--portal-text-primary)',
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--portal-success)',
                display: 'inline-block',
                boxShadow: '0 0 8px var(--portal-success)',
              }}
            />
            <span style={{ fontWeight: 700, color: 'var(--portal-success)' }}>Preview Mode:</span>
            <span>
              All studio guides, outlines, and editor chrome are hidden. All {totalCount} HeroUI
              components are fully interactive.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--portal-text-muted)' }}>
              Press <b>Esc</b> to return to Studio Editor
            </span>
            <button
              onClick={() => setIsPreviewMode(false)}
              style={{
                background: 'var(--portal-surface)',
                border: '1px solid var(--portal-border)',
                color: 'var(--portal-text-primary)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.725rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Exit Preview
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Body: 3-Pane Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel: HeroUI 72-Component Drawer */}
        {!isPreviewMode && (
          <aside
            style={{
              width: '300px',
              background: 'var(--portal-surface)',
              borderInlineEnd: '1px solid var(--portal-border)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'hidden',
            }}
          >
            {/* Left Panel Tabs: Sitemap vs Components */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--portal-border)',
                background: 'var(--portal-surface-elevated)',
              }}
            >
              <button
                id="tab-left-sitemap"
                type="button"
                onClick={() => setLeftPanelTab('sitemap')}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: leftPanelTab === 'sitemap' ? 'var(--portal-surface)' : 'transparent',
                  color:
                    leftPanelTab === 'sitemap'
                      ? 'var(--portal-accent)'
                      : 'var(--portal-text-secondary)',
                  border: 'none',
                  borderBottom:
                    leftPanelTab === 'sitemap'
                      ? '2px solid var(--portal-accent)'
                      : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <FolderTree size={14} />
                <span>Sitemap</span>
                <span
                  style={{
                    fontSize: '0.625rem',
                    padding: '1px 5px',
                    borderRadius: 'var(--radius-full)',
                    background:
                      leftPanelTab === 'sitemap'
                        ? 'rgba(59, 130, 246, 0.15)'
                        : 'var(--portal-surface-hover)',
                    color:
                      leftPanelTab === 'sitemap'
                        ? 'var(--portal-accent)'
                        : 'var(--portal-text-muted)',
                  }}
                >
                  {sitemapTree.length}
                </span>
              </button>
              <button
                id="tab-left-components"
                type="button"
                onClick={() => setLeftPanelTab('components')}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background:
                    leftPanelTab === 'components' ? 'var(--portal-surface)' : 'transparent',
                  color:
                    leftPanelTab === 'components'
                      ? 'var(--portal-accent)'
                      : 'var(--portal-text-secondary)',
                  border: 'none',
                  borderBottom:
                    leftPanelTab === 'components'
                      ? '2px solid var(--portal-accent)'
                      : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Component size={14} />
                <span>Components</span>
                <span
                  style={{
                    fontSize: '0.625rem',
                    padding: '1px 5px',
                    borderRadius: 'var(--radius-full)',
                    background:
                      leftPanelTab === 'components'
                        ? 'rgba(59, 130, 246, 0.15)'
                        : 'var(--portal-surface-hover)',
                    color:
                      leftPanelTab === 'components'
                        ? 'var(--portal-accent)'
                        : 'var(--portal-text-muted)',
                  }}
                >
                  {totalCount}
                </span>
              </button>
            </div>

            {/* TAB 1: SITEMAP HIERARCHY TREE */}
            {leftPanelTab === 'sitemap' && (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'hidden',
                }}
              >
                {/* Sitemap Header & Add Page Action */}
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--portal-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--portal-text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <FolderTree size={14} style={{ color: 'var(--portal-accent)' }} />
                      <span>Sitemap Hierarchy</span>
                    </div>
                    <div
                      style={{
                        fontSize: '0.65rem',
                        color: 'var(--portal-text-muted)',
                        marginTop: '2px',
                      }}
                    >
                      Click node to switch page on canvas
                    </div>
                  </div>

                  <button
                    id="btn-add-sitemap-page"
                    type="button"
                    onClick={() => setShowNewPageModal(true)}
                    title="Add New Page"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'var(--portal-surface-elevated)',
                      border: '1px solid var(--portal-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 8px',
                      color: 'var(--portal-accent)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={12} />
                    <span>New Page</span>
                  </button>
                </div>

                {/* Sitemap Tree View */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '0.65rem 0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {sitemapTree.map((node) => renderSitemapNode(node))}
                </div>

                {/* Sitemap Footer */}
                <div
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderTop: '1px solid var(--portal-border)',
                    background: 'var(--portal-surface-elevated)',
                    fontSize: '0.7rem',
                    color: 'var(--portal-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Globe size={13} style={{ color: 'var(--portal-accent)' }} />
                    <span>Active: {pagesRegistry[activePageId]?.route || '/managers'}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--portal-success)' }}>
                    {pagesRegistry[activePageId]?.requiredPermissions?.[0] || 'Public'}
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: HEROUI COMPONENT DRAWER */}
            {leftPanelTab === 'components' && (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '0.85rem 1rem 0.5rem',
                    borderBottom: '1px solid var(--portal-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--portal-text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Component size={14} style={{ color: 'var(--portal-accent)' }} />
                      <span>Components</span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.675rem',
                        color: 'var(--portal-text-muted)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      HeroUI v3 ({totalCount})
                    </span>
                  </div>

                  {/* HeroUI Search Input */}
                  <div style={{ position: 'relative' }}>
                    <Search
                      size={14}
                      style={{
                        position: 'absolute',
                        insetInlineStart: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--portal-text-muted)',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search 72 components..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--portal-surface-elevated)',
                        border: '1px solid var(--portal-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 10px 6px 32px',
                        fontSize: '0.75rem',
                        color: 'var(--portal-text-primary)',
                        outline: 'none',
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        style={{
                          position: 'absolute',
                          insetInlineEnd: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--portal-text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* "All Components (React)" Top Pill */}
                  <div
                    onClick={() => setSelectedCategory('all')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background:
                        selectedCategory === 'all'
                          ? 'rgba(59, 130, 246, 0.12)'
                          : 'var(--portal-surface-elevated)',
                      border: `1px solid ${selectedCategory === 'all' ? 'var(--portal-accent)' : 'var(--portal-border)'}`,
                      color:
                        selectedCategory === 'all'
                          ? 'var(--portal-accent)'
                          : 'var(--portal-text-primary)',
                      cursor: 'pointer',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Layers size={14} />
                      <span>All Components (React)</span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono)',
                        background:
                          selectedCategory === 'all'
                            ? 'var(--portal-accent)'
                            : 'var(--portal-surface-hover)',
                        color: selectedCategory === 'all' ? '#fff' : 'var(--portal-text-secondary)',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {filteredCatalog.length}
                    </span>
                  </div>
                </div>

                {/* HeroUI Category Quick Chips */}
                <div
                  style={{
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    gap: '4px',
                    overflowX: 'auto',
                    borderBottom: '1px solid var(--portal-border)',
                    background: 'var(--portal-surface-elevated)',
                  }}
                >
                  {[
                    'Form & Inputs',
                    'Pickers & Selectors',
                    'Layout & Structure',
                    'Interactive',
                    'Data Display',
                    'Feedback',
                    'Navigation',
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
                      style={{
                        background:
                          selectedCategory === cat
                            ? 'var(--portal-accent)'
                            : 'var(--portal-surface)',
                        color: selectedCategory === cat ? '#fff' : 'var(--portal-text-secondary)',
                        border: '1px solid var(--portal-border)',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* HeroUI Grouped Component List */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  {categoriesPresent.map((category) => {
                    const items = filteredCatalog.filter((item) => item.category === category);
                    return (
                      <div
                        key={category}
                        style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                      >
                        <div
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: 'var(--portal-text-muted)',
                            padding: '2px 6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>{category}</span>
                          <span style={{ fontSize: '0.65rem' }}>{items.length}</span>
                        </div>

                        {items.map((item) => {
                          const IconComp = item.icon;
                          const isAllowed = adminAllowedComponents[item.type] !== false;

                          return (
                            <div
                              key={item.type}
                              draggable={isAllowed}
                              onDragStart={(e) => {
                                if (!isAllowed) {
                                  e.preventDefault();
                                  return;
                                }
                                setDraggedComponentType(item.type);
                                e.dataTransfer.setData('text/plain', item.type);
                              }}
                              onDragEnd={() => setDraggedComponentType(null)}
                              onClick={() => {
                                if (!isAllowed) {
                                  alert(
                                    `[Admin Policy Restricted]: "${item.type}" has been restricted by the Administrator. Unlock it via Admin Governance.`,
                                  );
                                  return;
                                }
                                handleDropComponentIntoForm(item.type);
                              }}
                              title={
                                isAllowed
                                  ? `${item.type}: ${item.desc} (Drag into Form or click '+' to add)`
                                  : `[Restricted]: Disabled by Administrator governance policy`
                              }
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '6px 10px',
                                borderRadius: 'var(--radius-sm)',
                                background: isAllowed
                                  ? 'var(--portal-surface-elevated)'
                                  : 'rgba(245, 158, 11, 0.06)',
                                border: `1px solid ${isAllowed ? 'var(--portal-border)' : 'rgba(245, 158, 11, 0.3)'}`,
                                opacity: isAllowed ? 1 : 0.6,
                                cursor: isAllowed ? 'grab' : 'not-allowed',
                                transition: 'all 0.15s ease',
                                position: 'relative',
                              }}
                              onMouseEnter={(e) => {
                                if (isAllowed) {
                                  e.currentTarget.style.borderColor = 'var(--portal-border-active)';
                                  e.currentTarget.style.background = 'var(--portal-surface-hover)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (isAllowed) {
                                  e.currentTarget.style.borderColor = 'var(--portal-border)';
                                  e.currentTarget.style.background =
                                    'var(--portal-surface-elevated)';
                                }
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  minWidth: 0,
                                }}
                              >
                                <GripVertical
                                  size={12}
                                  style={{
                                    color: isAllowed
                                      ? 'var(--portal-text-muted)'
                                      : 'var(--portal-warning)',
                                    cursor: isAllowed ? 'grab' : 'not-allowed',
                                  }}
                                />
                                <IconComp
                                  size={15}
                                  style={{
                                    color: isAllowed
                                      ? 'var(--portal-accent)'
                                      : 'var(--portal-text-muted)',
                                    flexShrink: 0,
                                  }}
                                />
                                <div
                                  style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}
                                >
                                  <span
                                    style={{
                                      fontSize: '0.785rem',
                                      fontWeight: 600,
                                      color: isAllowed
                                        ? 'var(--portal-text-primary)'
                                        : 'var(--portal-text-muted)',
                                      textDecoration: isAllowed ? 'none' : 'line-through',
                                    }}
                                  >
                                    {item.type}
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {!isAllowed && (
                                  <span
                                    style={{
                                      fontSize: '0.625rem',
                                      padding: '1px 5px',
                                      borderRadius: 'var(--radius-sm)',
                                      background: 'rgba(245, 158, 11, 0.15)',
                                      color: 'var(--portal-warning)',
                                      fontWeight: 700,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                    }}
                                  >
                                    <Lock size={10} /> Restricted
                                  </span>
                                )}

                                {isAllowed && item.badge === 'New' && (
                                  <span
                                    style={{
                                      fontSize: '0.625rem',
                                      padding: '1px 6px',
                                      borderRadius: 'var(--radius-full)',
                                      background: 'rgba(236, 72, 153, 0.15)',
                                      color: '#ec4899',
                                      fontWeight: 700,
                                    }}
                                  >
                                    New
                                  </span>
                                )}

                                {isAllowed && item.badge === 'Updated' && (
                                  <span
                                    style={{
                                      fontSize: '0.625rem',
                                      padding: '1px 6px',
                                      borderRadius: 'var(--radius-full)',
                                      background: 'rgba(139, 92, 246, 0.15)',
                                      color: '#8b5cf6',
                                      fontWeight: 700,
                                    }}
                                  >
                                    Updated
                                  </span>
                                )}

                                {isAllowed && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDropComponentIntoForm(item.type);
                                    }}
                                    title={`Add ${item.type} to Form`}
                                    style={{
                                      background: 'transparent',
                                      border: 'none',
                                      color: 'var(--portal-accent)',
                                      padding: '2px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Plus size={13} />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                {/* Drawer Footer */}
                <div
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderTop: '1px solid var(--portal-border)',
                    background: 'var(--portal-surface-elevated)',
                    fontSize: '0.7rem',
                    color: 'var(--portal-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ShieldCheck size={13} style={{ color: 'var(--portal-success)' }} />
                    <span>Admin Policy Active</span>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--portal-text-primary)' }}>
                    {allowedCount}/{totalCount} Available
                  </span>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* Center: 12-Column Visual Grid Canvas with Move Controls & Drop Zone */}
        <main
          style={{
            flex: 1,
            background: 'var(--portal-bg)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: isPreviewMode ? '1.5rem 1rem' : '2rem 1.5rem',
            position: 'relative',
            transition: 'all 0.2s ease',
          }}
        >
          {/* Viewport Simulation Frame */}
          <div
            style={{
              width: getViewportWidth(),
              maxWidth: '100%',
              minHeight: '85vh',
              background: 'var(--portal-surface)',
              border: isPreviewMode
                ? '1px solid var(--portal-border)'
                : '1px solid var(--portal-border)',
              borderRadius: isPreviewMode ? 'var(--radius-lg)' : 'var(--radius-md)',
              boxShadow: isPreviewMode
                ? '0 12px 40px rgba(0, 0, 0, 0.25)'
                : '0 8px 32px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              transition: 'width 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* 12-Column Guide Overlay */}
            {showGrid && !isPreviewMode && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: 'none',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(12, 1fr)',
                  gap: '12px',
                  padding: 'var(--space-6)',
                  zIndex: 'var(--z-canvas-grid)',
                }}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: '100%',
                      background: 'var(--canvas-grid-line)',
                      borderInlineStart: '1px dashed rgba(37, 99, 235, 0.2)',
                      borderInlineEnd: '1px dashed rgba(37, 99, 235, 0.2)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      paddingTop: '4px',
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--portal-accent)',
                      opacity: 0.6,
                    }}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            )}

            {/* Canvas Sections Container */}
            <div
              style={{
                padding: 'var(--space-6)',
                position: 'relative',
                zIndex: 'var(--z-canvas-node)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {sectionOrder.map((sectionKey) => {
                // SECTION 1: PAGE HEADER
                if (sectionKey === 'header') {
                  return (
                    <div
                      key="header"
                      onClick={() => !isPreviewMode && setSelectedNodeId('node-header-title')}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border:
                          !isPreviewMode && selectedNodeId === 'node-header-title'
                            ? '2px solid var(--portal-border-active)'
                            : '2px solid transparent',
                        cursor: isPreviewMode ? 'default' : 'pointer',
                        position: 'relative',
                      }}
                    >
                      {!isPreviewMode && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                fontSize: '0.65rem',
                                fontFamily: 'var(--font-mono)',
                                background: 'var(--portal-surface-elevated)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                color: 'var(--portal-text-muted)',
                              }}
                            >
                              Col 1–12 (Desktop)
                            </span>
                            <span
                              style={{
                                fontSize: '0.65rem',
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--portal-accent)',
                              }}
                            >
                              #node-header-title
                            </span>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'var(--portal-surface-elevated)',
                              border: '1px solid var(--portal-border)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '1px 4px',
                            }}
                          >
                            <span
                              style={{ fontSize: '0.65rem', color: 'var(--portal-text-muted)' }}
                            >
                              Section:
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveCanvasSection('header', 'up');
                              }}
                              disabled={sectionOrder.indexOf('header') === 0}
                              title="Move Header Section Up"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color:
                                  sectionOrder.indexOf('header') === 0
                                    ? 'var(--portal-text-muted)'
                                    : 'var(--portal-accent)',
                                cursor:
                                  sectionOrder.indexOf('header') === 0 ? 'not-allowed' : 'pointer',
                                padding: '2px',
                                display: 'flex',
                              }}
                            >
                              <ChevronUp size={13} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveCanvasSection('header', 'down');
                              }}
                              disabled={sectionOrder.indexOf('header') === sectionOrder.length - 1}
                              title="Move Header Section Down"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color:
                                  sectionOrder.indexOf('header') === sectionOrder.length - 1
                                    ? 'var(--portal-text-muted)'
                                    : 'var(--portal-accent)',
                                cursor:
                                  sectionOrder.indexOf('header') === sectionOrder.length - 1
                                    ? 'not-allowed'
                                    : 'pointer',
                                padding: '2px',
                                display: 'flex',
                              }}
                            >
                              <ChevronDown size={13} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCanvasSection('header');
                              }}
                              title="Remove Header Section from Canvas"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--portal-error)',
                                cursor: 'pointer',
                                padding: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                borderInlineStart: '1px solid var(--portal-border)',
                                marginInlineStart: '2px',
                                paddingInlineStart: '4px',
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      )}

                      <h1
                        style={{
                          fontSize: '1.75rem',
                          fontWeight: 700,
                          letterSpacing: '-0.02em',
                          color: 'var(--portal-text-primary)',
                          marginBottom: '0.35rem',
                        }}
                      >
                        {pagesRegistry[activePageId]?.title || 'Personnel & Management Directory'}
                      </h1>
                      <p
                        style={{
                          fontSize: '0.9rem',
                          color: 'var(--portal-text-secondary)',
                          maxWidth: '720px',
                        }}
                      >
                        {pagesRegistry[activePageId]?.description ||
                          'Powered by 72 HeroUI v3 accessible components. Demonstrates drag-and-drop assembly, element movement, Administrator governance, and interactive live preview mode.'}
                      </p>
                    </div>
                  );
                }

                // SECTION 2: INTERACTIVE <FORM> CONTAINER
                if (sectionKey === 'form') {
                  return (
                    <div
                      key="form"
                      onClick={() => !isPreviewMode && setSelectedNodeId('node-manager-form')}
                      onDragOver={(e) => {
                        if (!isPreviewMode) {
                          e.preventDefault();
                          setIsDropOverForm(true);
                        }
                      }}
                      onDragLeave={() => setIsDropOverForm(false)}
                      onDrop={(e) => {
                        if (!isPreviewMode) {
                          e.preventDefault();
                          setIsDropOverForm(false);
                          const componentType =
                            e.dataTransfer.getData('text/plain') || draggedComponentType;
                          if (componentType) {
                            handleDropComponentIntoForm(componentType);
                          }
                        }
                      }}
                      style={{
                        background: 'var(--portal-surface-elevated)',
                        border:
                          !isPreviewMode && selectedNodeId === 'node-manager-form'
                            ? '2px solid var(--portal-border-active)'
                            : isDropOverForm
                              ? '2px dashed var(--portal-accent)'
                              : '1px solid var(--portal-border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                        overflow: 'visible',
                        cursor: isPreviewMode ? 'default' : 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Form Header */}
                      <div
                        style={{
                          padding: '0.65rem 1rem',
                          background: 'var(--portal-surface)',
                          borderBottom: '1px solid var(--portal-border)',
                          borderTopLeftRadius: 'calc(var(--radius-md) - 1px)',
                          borderTopRightRadius: 'calc(var(--radius-md) - 1px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FormInput size={15} style={{ color: 'var(--portal-accent)' }} />
                          <span style={{ fontSize: '0.825rem', fontWeight: 700 }}>
                            Employee Onboarding & Registration Form
                          </span>
                          {!isPreviewMode && (
                            <span
                              style={{
                                fontSize: '0.65rem',
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--portal-text-muted)',
                              }}
                            >
                              #node-manager-form (12 Columns)
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {!isPreviewMode && (
                            <>
                              <span
                                style={{
                                  fontSize: '0.65rem',
                                  background: 'rgba(59, 130, 246, 0.15)',
                                  color: 'var(--portal-accent)',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontWeight: 600,
                                }}
                              >
                                Mutation: POST /api/employees
                              </span>

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                  background: 'var(--portal-surface-elevated)',
                                  border: '1px solid var(--portal-border)',
                                  borderRadius: 'var(--radius-sm)',
                                  padding: '1px 4px',
                                }}
                              >
                                <span
                                  style={{ fontSize: '0.65rem', color: 'var(--portal-text-muted)' }}
                                >
                                  Section:
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveCanvasSection('form', 'up');
                                  }}
                                  disabled={sectionOrder.indexOf('form') === 0}
                                  title="Move Form Section Up"
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color:
                                      sectionOrder.indexOf('form') === 0
                                        ? 'var(--portal-text-muted)'
                                        : 'var(--portal-accent)',
                                    cursor:
                                      sectionOrder.indexOf('form') === 0
                                        ? 'not-allowed'
                                        : 'pointer',
                                    padding: '2px',
                                    display: 'flex',
                                  }}
                                >
                                  <ChevronUp size={13} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveCanvasSection('form', 'down');
                                  }}
                                  disabled={
                                    sectionOrder.indexOf('form') === sectionOrder.length - 1
                                  }
                                  title="Move Form Section Down"
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color:
                                      sectionOrder.indexOf('form') === sectionOrder.length - 1
                                        ? 'var(--portal-text-muted)'
                                        : 'var(--portal-accent)',
                                    cursor:
                                      sectionOrder.indexOf('form') === sectionOrder.length - 1
                                        ? 'not-allowed'
                                        : 'pointer',
                                    padding: '2px',
                                    display: 'flex',
                                  }}
                                >
                                  <ChevronDown size={13} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeCanvasSection('form');
                                  }}
                                  title="Remove Form Section from Canvas"
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--portal-error)',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderInlineStart: '1px solid var(--portal-border)',
                                    marginInlineStart: '2px',
                                    paddingInlineStart: '4px',
                                  }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </>
                          )}

                          <span
                            style={{
                              fontSize: '0.65rem',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: 'var(--portal-success)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}
                          >
                            {formFields.length} Controls
                          </span>
                        </div>
                      </div>

                      {/* Form Fields Canvas */}
                      <form onSubmit={handleLiveFormSubmit} style={{ padding: '1.25rem' }}>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(12, 1fr)',
                            gap: '1rem',
                          }}
                        >
                          {formFields.map((field, idx) => {
                            const isFieldSelected = selectedNodeId === field.id && !isPreviewMode;
                            const isDropTarget = dragOverFieldId === field.id && !isPreviewMode;

                            return (
                              <div
                                key={field.id}
                                draggable={!isPreviewMode}
                                onDragStart={(e) => {
                                  if (isPreviewMode) return;
                                  setDraggedFieldId(field.id);
                                  e.dataTransfer.setData('text/field-reorder-id', field.id);
                                }}
                                onDragOver={(e) => {
                                  if (isPreviewMode) return;
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDragOverFieldId(field.id);
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const isRightSide = e.clientX > rect.left + rect.width / 2;
                                  setDropIndicatorSide(isRightSide ? 'after' : 'before');
                                }}
                                onDragLeave={() => {
                                  if (dragOverFieldId === field.id) setDragOverFieldId(null);
                                }}
                                onDrop={(e) => {
                                  if (isPreviewMode) return;
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const sourceId =
                                    e.dataTransfer.getData('text/field-reorder-id') ||
                                    draggedFieldId;
                                  if (sourceId && sourceId !== field.id) {
                                    handleReorderFormField(sourceId, field.id, dropIndicatorSide);
                                  }
                                  setDraggedFieldId(null);
                                  setDragOverFieldId(null);
                                }}
                                onClick={(e) => {
                                  if (!isPreviewMode) {
                                    e.stopPropagation();
                                    setSelectedNodeId(field.id);
                                  }
                                }}
                                style={{
                                  gridColumn: `span ${field.layout.colSpan || 6}`,
                                  background: isFieldSelected
                                    ? 'var(--portal-surface-hover)'
                                    : 'var(--portal-surface)',
                                  border: isFieldSelected
                                    ? '2px solid var(--portal-border-active)'
                                    : isDropTarget
                                      ? '2px solid var(--portal-accent)'
                                      : '1px solid var(--portal-border)',
                                  borderRadius: 'var(--radius-sm)',
                                  padding: isPreviewMode ? '0.65rem 0.5rem' : '0.75rem',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.4rem',
                                  position: 'relative',
                                  zIndex: liveFormValues[field.id + '_flyout']
                                    ? 40
                                    : isFieldSelected
                                      ? 3
                                      : 1,
                                  transition: 'all 0.15s ease',
                                  boxShadow: isDropTarget
                                    ? '0 0 12px rgba(59, 130, 246, 0.3)'
                                    : 'none',
                                }}
                              >
                                {!isPreviewMode && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      fontSize: '0.675rem',
                                      color: 'var(--portal-text-muted)',
                                      borderBottom: '1px solid var(--portal-border)',
                                      paddingBottom: '4px',
                                      marginBottom: '2px',
                                    }}
                                  >
                                    <div
                                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                      <span
                                        title="Drag to reorder position"
                                        style={{ cursor: 'grab', display: 'flex' }}
                                      >
                                        <GripVertical size={12} />
                                      </span>
                                      <span
                                        style={{
                                          fontFamily: 'var(--font-mono)',
                                          background: 'var(--portal-surface-elevated)',
                                          padding: '1px 5px',
                                          borderRadius: '3px',
                                          color: 'var(--portal-accent)',
                                          fontWeight: 600,
                                        }}
                                      >
                                        {field.type}
                                      </span>
                                      <span>Span {field.layout.colSpan} Col</span>
                                    </div>

                                    <div
                                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          moveFormField(idx, idx - 1);
                                        }}
                                        disabled={idx === 0}
                                        title="Move Element Earlier (Shift Left/Up)"
                                        style={{
                                          background: 'var(--portal-surface-elevated)',
                                          border: '1px solid var(--portal-border)',
                                          borderRadius: '3px',
                                          color:
                                            idx === 0
                                              ? 'var(--portal-text-muted)'
                                              : 'var(--portal-text-primary)',
                                          cursor: idx === 0 ? 'not-allowed' : 'pointer',
                                          padding: '2px 4px',
                                          display: 'flex',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <ChevronUp size={11} />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          moveFormField(idx, idx + 1);
                                        }}
                                        disabled={idx === formFields.length - 1}
                                        title="Move Element Later (Shift Right/Down)"
                                        style={{
                                          background: 'var(--portal-surface-elevated)',
                                          border: '1px solid var(--portal-border)',
                                          borderRadius: '3px',
                                          color:
                                            idx === formFields.length - 1
                                              ? 'var(--portal-text-muted)'
                                              : 'var(--portal-text-primary)',
                                          cursor:
                                            idx === formFields.length - 1
                                              ? 'not-allowed'
                                              : 'pointer',
                                          padding: '2px 4px',
                                          display: 'flex',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <ChevronDown size={11} />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={(e) => handleDeleteFormField(field.id, e)}
                                        title="Remove field from form"
                                        style={{
                                          background: 'transparent',
                                          border: 'none',
                                          color: 'var(--portal-error)',
                                          cursor: 'pointer',
                                          padding: '1px',
                                          display: 'flex',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* RENDER DYNAMIC HEROUI V3 COMPONENT */}
                                {renderHeroUIComponent(
                                  field,
                                  isPreviewMode,
                                  liveFormValues,
                                  setLiveFormValues,
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Drop Zone Highlight */}
                        {!isPreviewMode && (
                          <div
                            style={{
                              marginTop: '1rem',
                              padding: '1.25rem',
                              borderRadius: 'var(--radius-md)',
                              border: isDropOverForm
                                ? '2px dashed var(--portal-accent)'
                                : '2px dashed var(--portal-border)',
                              background: isDropOverForm
                                ? 'rgba(59, 130, 246, 0.08)'
                                : 'var(--portal-surface-hover)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              textAlign: 'center',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: isDropOverForm
                                  ? 'var(--portal-accent)'
                                  : 'var(--portal-surface)',
                                color: isDropOverForm ? '#fff' : 'var(--portal-text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Plus size={18} />
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  color: isDropOverForm
                                    ? 'var(--portal-accent)'
                                    : 'var(--portal-text-primary)',
                                }}
                              >
                                {isDropOverForm
                                  ? 'Release to insert into Form container'
                                  : 'Drop HeroUI v3 Components Here'}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.725rem',
                                  color: 'var(--portal-text-muted)',
                                  maxWidth: '460px',
                                }}
                              >
                                Supports all {totalCount} HeroUI components (Pickers, Inputs,
                                Colors, Dialogs, Radios, Sliders, OTP). Drag to reorder or click
                                arrow buttons.
                              </div>
                            </div>
                          </div>
                        )}
                      </form>
                    </div>
                  );
                }

                // SECTION 3: EMPLOYEE TABLE
                if (sectionKey === 'table') {
                  return (
                    <div
                      key="table"
                      onClick={() => !isPreviewMode && setSelectedNodeId('node-employee-table')}
                      style={{
                        background: 'var(--portal-surface-elevated)',
                        border:
                          !isPreviewMode && selectedNodeId === 'node-employee-table'
                            ? '2px solid var(--portal-border-active)'
                            : '1px solid var(--portal-border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                        overflow: 'hidden',
                        cursor: isPreviewMode ? 'default' : 'pointer',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'var(--portal-surface)',
                          borderBottom: '1px solid var(--portal-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <TableIcon size={14} style={{ color: 'var(--portal-accent)' }} />
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                            Table Component (12 Columns)
                          </span>
                          {!isPreviewMode && (
                            <span
                              style={{
                                fontSize: '0.65rem',
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--portal-text-muted)',
                              }}
                            >
                              #node-employee-table
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {!isPreviewMode && (
                            <>
                              <span
                                style={{
                                  fontSize: '0.65rem',
                                  background: 'rgba(59, 130, 246, 0.15)',
                                  color: 'var(--portal-accent)',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontWeight: 600,
                                }}
                              >
                                Bound: $.data
                              </span>

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                  background: 'var(--portal-surface-elevated)',
                                  border: '1px solid var(--portal-border)',
                                  borderRadius: 'var(--radius-sm)',
                                  padding: '1px 4px',
                                }}
                              >
                                <span
                                  style={{ fontSize: '0.65rem', color: 'var(--portal-text-muted)' }}
                                >
                                  Section:
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveCanvasSection('table', 'up');
                                  }}
                                  disabled={sectionOrder.indexOf('table') === 0}
                                  title="Move Table Section Up"
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color:
                                      sectionOrder.indexOf('table') === 0
                                        ? 'var(--portal-text-muted)'
                                        : 'var(--portal-accent)',
                                    cursor:
                                      sectionOrder.indexOf('table') === 0
                                        ? 'not-allowed'
                                        : 'pointer',
                                    padding: '2px',
                                    display: 'flex',
                                  }}
                                >
                                  <ChevronUp size={13} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveCanvasSection('table', 'down');
                                  }}
                                  disabled={
                                    sectionOrder.indexOf('table') === sectionOrder.length - 1
                                  }
                                  title="Move Table Section Down"
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color:
                                      sectionOrder.indexOf('table') === sectionOrder.length - 1
                                        ? 'var(--portal-text-muted)'
                                        : 'var(--portal-accent)',
                                    cursor:
                                      sectionOrder.indexOf('table') === sectionOrder.length - 1
                                        ? 'not-allowed'
                                        : 'pointer',
                                    padding: '2px',
                                    display: 'flex',
                                  }}
                                >
                                  <ChevronDown size={13} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeCanvasSection('table');
                                  }}
                                  title="Remove Table Component from Canvas"
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--portal-error)',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderInlineStart: '1px solid var(--portal-border)',
                                    marginInlineStart: '2px',
                                    paddingInlineStart: '4px',
                                  }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </>
                          )}

                          <span
                            style={{
                              fontSize: '0.65rem',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: 'var(--portal-success)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}
                          >
                            employees.read
                          </span>
                        </div>
                      </div>

                      <table
                        style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}
                      >
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
                                color: 'var(--portal-text-secondary)',
                                fontWeight: 600,
                              }}
                            >
                              Department
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
                          {employees.map((emp) => (
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
                                {emp.id}
                              </td>
                              <td
                                style={{
                                  padding: '0.75rem 1rem',
                                  fontWeight: 600,
                                  color: 'var(--portal-text-primary)',
                                }}
                              >
                                {emp.name}
                              </td>
                              <td style={{ padding: '0.75rem 1rem' }}>
                                <span
                                  style={{
                                    background: 'var(--portal-surface)',
                                    border: '1px solid var(--portal-border)',
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                  }}
                                >
                                  {emp.department.name}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: '0.75rem 1rem',
                                  color: 'var(--portal-text-secondary)',
                                }}
                              >
                                {emp.jobTitle}
                              </td>
                              <td
                                style={{
                                  padding: '0.75rem 1rem',
                                  color: 'var(--portal-accent)',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {emp.email}
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
                                  />
                                  {emp.active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                return null;
              })}

              {/* Canvas Section Restore Bar if any sections were removed */}
              {!isPreviewMode && sectionOrder.length < 3 && (
                <div
                  style={{
                    border: '1px dashed var(--portal-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    background: 'var(--portal-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={14} style={{ color: 'var(--portal-text-muted)' }} />
                    <span style={{ fontSize: '0.775rem', color: 'var(--portal-text-secondary)' }}>
                      Available canvas sections:
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {!sectionOrder.includes('table') && (
                      <button
                        onClick={() => restoreCanvasSection('table')}
                        title="Restore Table Component to Canvas"
                        style={{
                          background: 'rgba(59, 130, 246, 0.12)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: 'var(--portal-accent)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.725rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <Plus size={13} />
                        <span>Restore Table Component</span>
                      </button>
                    )}
                    {!sectionOrder.includes('form') && (
                      <button
                        onClick={() => restoreCanvasSection('form')}
                        title="Restore Form Section to Canvas"
                        style={{
                          background: 'rgba(59, 130, 246, 0.12)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: 'var(--portal-accent)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.725rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <Plus size={13} />
                        <span>Restore Form Section</span>
                      </button>
                    )}
                    {!sectionOrder.includes('header') && (
                      <button
                        onClick={() => restoreCanvasSection('header')}
                        title="Restore Header Section to Canvas"
                        style={{
                          background: 'rgba(59, 130, 246, 0.12)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: 'var(--portal-accent)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.725rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <Plus size={13} />
                        <span>Restore Header Section</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Inspector Panel */}
        {!isPreviewMode && (
          <aside
            style={{
              width: '320px',
              background: 'var(--portal-surface)',
              borderInlineStart: '1px solid var(--portal-border)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            <div
              style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--portal-border)' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--portal-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Component Inspector
                  </div>
                  <div
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: 'var(--portal-text-primary)',
                      marginTop: '2px',
                    }}
                  >
                    {selectedNode ? selectedNode.type : 'Select Node'}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--portal-accent)',
                    }}
                  >
                    {selectedNodeId}
                  </div>
                </div>

                {(selectedNodeId === 'node-employee-table' ||
                  formFields.some((f) => f.id === selectedNodeId)) && (
                  <button
                    onClick={(e) => {
                      if (selectedNodeId === 'node-employee-table') {
                        removeCanvasSection('table');
                      } else {
                        handleDeleteFormField(selectedNodeId, e);
                      }
                    }}
                    title={
                      selectedNodeId === 'node-employee-table'
                        ? 'Remove Table Component from Canvas'
                        : 'Delete Component'
                    }
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: 'var(--portal-error)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                )}
              </div>

              {/* Viewport Selectors inside Component Inspector */}
              <div style={{ marginTop: '0.85rem' }}>
                <div
                  style={{
                    fontSize: '0.675rem',
                    fontWeight: 600,
                    color: 'var(--portal-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.35rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Viewport Preview</span>
                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--portal-accent)',
                    }}
                  >
                    {viewport === 'desktop'
                      ? '12 Col Grid'
                      : viewport === 'tablet'
                        ? '768px'
                        : '390px'}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    background: 'var(--portal-surface-elevated)',
                    border: '1px solid var(--portal-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '2px',
                    gap: '2px',
                  }}
                >
                  <button
                    onClick={() => setViewport('desktop')}
                    title="Desktop Viewport (12 Columns Grid)"
                    style={{
                      flex: 1,
                      background: viewport === 'desktop' ? 'var(--portal-accent)' : 'transparent',
                      color: viewport === 'desktop' ? '#fff' : 'var(--portal-text-secondary)',
                      border: 'none',
                      padding: '6px 4px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Laptop size={14} />
                  </button>
                  <button
                    onClick={() => setViewport('tablet')}
                    title="Tablet Viewport (768px Width)"
                    style={{
                      flex: 1,
                      background: viewport === 'tablet' ? 'var(--portal-accent)' : 'transparent',
                      color: viewport === 'tablet' ? '#fff' : 'var(--portal-text-secondary)',
                      border: 'none',
                      padding: '6px 4px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Tablet size={14} />
                  </button>
                  <button
                    onClick={() => setViewport('mobile')}
                    title="Mobile Viewport (390px Width)"
                    style={{
                      flex: 1,
                      background: viewport === 'mobile' ? 'var(--portal-accent)' : 'transparent',
                      color: viewport === 'mobile' ? '#fff' : 'var(--portal-text-secondary)',
                      border: 'none',
                      padding: '6px 4px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Smartphone size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Inspector Tab Bar */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--portal-border)',
                background: 'var(--portal-surface-elevated)',
              }}
            >
              <button
                onClick={() => setInspectorTab('properties')}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom:
                    inspectorTab === 'properties'
                      ? '2px solid var(--portal-accent)'
                      : '2px solid transparent',
                  color:
                    inspectorTab === 'properties'
                      ? 'var(--portal-accent)'
                      : 'var(--portal-text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Props
              </button>
              <button
                onClick={() => setInspectorTab('grid')}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom:
                    inspectorTab === 'grid'
                      ? '2px solid var(--portal-accent)'
                      : '2px solid transparent',
                  color:
                    inspectorTab === 'grid'
                      ? 'var(--portal-accent)'
                      : 'var(--portal-text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Grid & Move
              </button>
              <button
                onClick={() => setInspectorTab('binding')}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom:
                    inspectorTab === 'binding'
                      ? '2px solid var(--portal-accent)'
                      : '2px solid transparent',
                  color:
                    inspectorTab === 'binding'
                      ? 'var(--portal-accent)'
                      : 'var(--portal-text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Binding (P5)
              </button>
              <button
                onClick={() => setInspectorTab('permissions')}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom:
                    inspectorTab === 'permissions'
                      ? '2px solid var(--portal-accent)'
                      : '2px solid transparent',
                  color:
                    inspectorTab === 'permissions'
                      ? 'var(--portal-accent)'
                      : 'var(--portal-text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                RBAC
              </button>
            </div>

            {/* Inspector Content */}
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* TAB 1: PROPERTIES */}
              {inspectorTab === 'properties' && (
                <>
                  <div>
                    <label
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--portal-text-secondary)',
                        display: 'block',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Component ID
                    </label>
                    <input
                      type="text"
                      value={selectedNodeId}
                      disabled
                      style={{
                        width: '100%',
                        background: 'var(--portal-surface-elevated)',
                        border: '1px solid var(--portal-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 8px',
                        color: 'var(--portal-text-muted)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                      }}
                    />
                  </div>

                  {selectedNode?.props?.label !== undefined && (
                    <div>
                      <label
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--portal-text-secondary)',
                          display: 'block',
                          marginBottom: '0.35rem',
                        }}
                      >
                        Field Label
                      </label>
                      <input
                        type="text"
                        value={selectedNode.props.label}
                        onChange={(e) => updateNodeProperty('label', e.target.value)}
                        style={{
                          width: '100%',
                          background: 'var(--portal-surface-elevated)',
                          border: '1px solid var(--portal-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 8px',
                          color: 'var(--portal-text-primary)',
                          fontSize: '0.8rem',
                        }}
                      />
                    </div>
                  )}

                  {selectedNode?.props?.placeholder !== undefined && (
                    <div>
                      <label
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--portal-text-secondary)',
                          display: 'block',
                          marginBottom: '0.35rem',
                        }}
                      >
                        Placeholder Text
                      </label>
                      <input
                        type="text"
                        value={selectedNode.props.placeholder}
                        onChange={(e) => updateNodeProperty('placeholder', e.target.value)}
                        style={{
                          width: '100%',
                          background: 'var(--portal-surface-elevated)',
                          border: '1px solid var(--portal-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 8px',
                          color: 'var(--portal-text-primary)',
                          fontSize: '0.8rem',
                        }}
                      />
                    </div>
                  )}

                  {selectedNode?.props?.required !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        id="prop-required"
                        checked={selectedNode.props.required}
                        onChange={(e) => updateNodeProperty('required', e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      <label
                        htmlFor="prop-required"
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--portal-text-primary)',
                          cursor: 'pointer',
                        }}
                      >
                        Required Field (Validation Enforcement)
                      </label>
                    </div>
                  )}

                  {selectedNode?.props?.title !== undefined && (
                    <div>
                      <label
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--portal-text-secondary)',
                          display: 'block',
                          marginBottom: '0.35rem',
                        }}
                      >
                        Component Title
                      </label>
                      <input
                        type="text"
                        value={selectedNode.props.title}
                        onChange={(e) => updateNodeProperty('title', e.target.value)}
                        style={{
                          width: '100%',
                          background: 'var(--portal-surface-elevated)',
                          border: '1px solid var(--portal-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 8px',
                          color: 'var(--portal-text-primary)',
                          fontSize: '0.8rem',
                        }}
                      />
                    </div>
                  )}

                  {selectedNode?.props?.content !== undefined && (
                    <div>
                      <label
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--portal-text-secondary)',
                          display: 'block',
                          marginBottom: '0.35rem',
                        }}
                      >
                        Body Content
                      </label>
                      <textarea
                        value={selectedNode.props.content}
                        onChange={(e) => updateNodeProperty('content', e.target.value)}
                        rows={3}
                        style={{
                          width: '100%',
                          background: 'var(--portal-surface-elevated)',
                          border: '1px solid var(--portal-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 8px',
                          color: 'var(--portal-text-primary)',
                          fontSize: '0.8rem',
                          resize: 'vertical',
                        }}
                      />
                    </div>
                  )}

                  {/* Accordion Specific Properties & Data Source (HeroUI v3 specification) */}
                  {selectedNode?.type === 'Accordion' && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem',
                        marginTop: '0.25rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid var(--portal-border)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'var(--portal-accent)',
                        }}
                      >
                        HeroUI v3 Accordion Settings
                      </div>

                      {/* Variant */}
                      <div>
                        <label
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--portal-text-secondary)',
                            display: 'block',
                            marginBottom: '0.35rem',
                          }}
                        >
                          Accordion Variant
                        </label>
                        <select
                          value={selectedNode.props.variant || 'surface'}
                          onChange={(e) => updateNodeProperty('variant', e.target.value)}
                          style={{
                            width: '100%',
                            background: 'var(--portal-surface-elevated)',
                            border: '1px solid var(--portal-border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '6px 8px',
                            color: 'var(--portal-text-primary)',
                            fontSize: '0.8rem',
                          }}
                        >
                          <option value="surface">Surface (Card Enclosure)</option>
                          <option value="default">Default (Borderless Separators)</option>
                        </select>
                      </div>

                      {/* Align Control to Center */}
                      <div>
                        <label
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--portal-text-secondary)',
                            display: 'block',
                            marginBottom: '0.35rem',
                          }}
                        >
                          Control Horizontal Alignment
                        </label>
                        <select
                          value={selectedNode.props.align || 'stretch'}
                          onChange={(e) => updateNodeProperty('align', e.target.value)}
                          style={{
                            width: '100%',
                            background: 'var(--portal-surface-elevated)',
                            border: '1px solid var(--portal-border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '6px 8px',
                            color: 'var(--portal-text-primary)',
                            fontSize: '0.8rem',
                          }}
                        >
                          <option value="center">Center Control (Horizontally Centered)</option>
                          <option value="stretch">Stretch (Full Width)</option>
                          <option value="start">Start (Align Left)</option>
                          <option value="end">End (Align Right)</option>
                        </select>
                      </div>

                      {/* Max Container Width */}
                      <div>
                        <label
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--portal-text-secondary)',
                            display: 'block',
                            marginBottom: '0.35rem',
                          }}
                        >
                          Max Container Width
                        </label>
                        <select
                          value={selectedNode.props.maxWidth || '100%'}
                          onChange={(e) => updateNodeProperty('maxWidth', e.target.value)}
                          style={{
                            width: '100%',
                            background: 'var(--portal-surface-elevated)',
                            border: '1px solid var(--portal-border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '6px 8px',
                            color: 'var(--portal-text-primary)',
                            fontSize: '0.8rem',
                          }}
                        >
                          <option value="100%">100% (Full Width)</option>
                          <option value="480px">Compact (480px / max-w-md)</option>
                          <option value="560px">Medium (560px / max-w-lg)</option>
                          <option value="640px">Standard (640px / max-w-xl)</option>
                          <option value="768px">Wide (768px)</option>
                        </select>
                      </div>

                      {/* Trigger Title Alignment */}
                      <div>
                        <label
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--portal-text-secondary)',
                            display: 'block',
                            marginBottom: '0.35rem',
                          }}
                        >
                          Trigger Title Alignment
                        </label>
                        <select
                          value={selectedNode.props.titleAlign || 'start'}
                          onChange={(e) => updateNodeProperty('titleAlign', e.target.value)}
                          style={{
                            width: '100%',
                            background: 'var(--portal-surface-elevated)',
                            border: '1px solid var(--portal-border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '6px 8px',
                            color: 'var(--portal-text-primary)',
                            fontSize: '0.8rem',
                          }}
                        >
                          <option value="start">Start (Left Aligned)</option>
                          <option value="center">Center (Centered Title)</option>
                          <option value="end">End (Right Aligned)</option>
                        </select>
                      </div>

                      {/* Checkboxes: allowsMultipleExpanded, hideSeparator, isDisabled */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            id="prop-allows-multiple"
                            checked={!!selectedNode.props.allowsMultipleExpanded}
                            onChange={(e) =>
                              updateNodeProperty('allowsMultipleExpanded', e.target.checked)
                            }
                            style={{ cursor: 'pointer' }}
                          />
                          <label
                            htmlFor="prop-allows-multiple"
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--portal-text-primary)',
                              cursor: 'pointer',
                            }}
                          >
                            Allow Multiple Expanded Panels
                          </label>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            id="prop-hide-separator"
                            checked={!!selectedNode.props.hideSeparator}
                            onChange={(e) => updateNodeProperty('hideSeparator', e.target.checked)}
                            style={{ cursor: 'pointer' }}
                          />
                          <label
                            htmlFor="prop-hide-separator"
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--portal-text-primary)',
                              cursor: 'pointer',
                            }}
                          >
                            Hide Separators Between Items
                          </label>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            id="prop-is-disabled"
                            checked={!!selectedNode.props.isDisabled}
                            onChange={(e) => updateNodeProperty('isDisabled', e.target.checked)}
                            style={{ cursor: 'pointer' }}
                          />
                          <label
                            htmlFor="prop-is-disabled"
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--portal-text-primary)',
                              cursor: 'pointer',
                            }}
                          >
                            Disable Entire Accordion
                          </label>
                        </div>
                      </div>

                      {/* DATA SOURCE: Static JSON vs API Endpoint */}
                      <div
                        style={{
                          marginTop: '0.5rem',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid var(--portal-border)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: 'var(--portal-accent)',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Data Source (Static JSON vs API)
                        </div>

                        <div style={{ display: 'flex', gap: '6px', marginBottom: '0.75rem' }}>
                          <button
                            id="btn-accordion-datasource-static"
                            type="button"
                            onClick={() => updateNodeProperty('dataSource', 'static')}
                            style={{
                              flex: 1,
                              padding: '5px 8px',
                              borderRadius: 'var(--radius-sm)',
                              border:
                                '1px solid ' +
                                ((selectedNode.props.dataSource || 'static') === 'static'
                                  ? 'var(--portal-accent)'
                                  : 'var(--portal-border)'),
                              background:
                                (selectedNode.props.dataSource || 'static') === 'static'
                                  ? 'rgba(59, 130, 246, 0.15)'
                                  : 'var(--portal-surface-elevated)',
                              color:
                                (selectedNode.props.dataSource || 'static') === 'static'
                                  ? 'var(--portal-accent)'
                                  : 'var(--portal-text-secondary)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Static JSON
                          </button>
                          <button
                            id="btn-accordion-datasource-api"
                            type="button"
                            onClick={() => updateNodeProperty('dataSource', 'api')}
                            style={{
                              flex: 1,
                              padding: '5px 8px',
                              borderRadius: 'var(--radius-sm)',
                              border:
                                '1px solid ' +
                                (selectedNode.props.dataSource === 'api'
                                  ? 'var(--portal-accent)'
                                  : 'var(--portal-border)'),
                              background:
                                selectedNode.props.dataSource === 'api'
                                  ? 'rgba(59, 130, 246, 0.15)'
                                  : 'var(--portal-surface-elevated)',
                              color:
                                selectedNode.props.dataSource === 'api'
                                  ? 'var(--portal-accent)'
                                  : 'var(--portal-text-secondary)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            API Endpoint
                          </button>
                        </div>

                        {/* If API Mode */}
                        {selectedNode.props.dataSource === 'api' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div>
                              <label
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  color: 'var(--portal-text-secondary)',
                                  display: 'block',
                                  marginBottom: '2px',
                                }}
                              >
                                API Endpoint URL
                              </label>
                              <input
                                id="input-accordion-api-endpoint"
                                type="text"
                                value={selectedNode.props.apiEndpoint || '/api/accordion-items'}
                                onChange={(e) => updateNodeProperty('apiEndpoint', e.target.value)}
                                placeholder="/api/accordion-items"
                                style={{
                                  width: '100%',
                                  background: 'var(--portal-surface-elevated)',
                                  border: '1px solid var(--portal-border)',
                                  borderRadius: 'var(--radius-sm)',
                                  padding: '5px 8px',
                                  color: 'var(--portal-text-primary)',
                                  fontSize: '0.75rem',
                                  fontFamily: 'var(--font-mono)',
                                }}
                              />
                            </div>

                            <div>
                              <label
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  color: 'var(--portal-text-secondary)',
                                  display: 'block',
                                  marginBottom: '2px',
                                }}
                              >
                                JSON Data Path (e.g. $.data)
                              </label>
                              <input
                                id="input-accordion-data-path"
                                type="text"
                                value={selectedNode.props.dataPath || '$.data'}
                                onChange={(e) => updateNodeProperty('dataPath', e.target.value)}
                                placeholder="$.data"
                                style={{
                                  width: '100%',
                                  background: 'var(--portal-surface-elevated)',
                                  border: '1px solid var(--portal-border)',
                                  borderRadius: 'var(--radius-sm)',
                                  padding: '5px 8px',
                                  color: 'var(--portal-text-primary)',
                                  fontSize: '0.75rem',
                                  fontFamily: 'var(--font-mono)',
                                }}
                              />
                            </div>

                            <button
                              id="btn-accordion-fetch-api"
                              type="button"
                              onClick={() =>
                                handleFetchAccordionApi(
                                  selectedNode.id,
                                  selectedNode.props.apiEndpoint || '/api/accordion-items',
                                  selectedNode.props.dataPath || '$.data',
                                )
                              }
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                background: 'var(--portal-accent)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                padding: '6px 10px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginTop: '4px',
                              }}
                            >
                              <Database size={13} /> Fetch API Data Now
                            </button>

                            {accordionApiStatus && (
                              <div
                                style={{
                                  fontSize: '0.7rem',
                                  color: accordionApiStatus.startsWith('Error')
                                    ? 'var(--portal-error)'
                                    : 'var(--portal-success)',
                                  marginTop: '2px',
                                }}
                              >
                                {accordionApiStatus}
                              </div>
                            )}

                            {/* RFC 9535 Dynamic Field Mapping Controls */}
                            <div
                              style={{
                                marginTop: '0.65rem',
                                paddingTop: '0.65rem',
                                borderTop: '1px dashed var(--portal-border)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: '0.675rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: 'var(--portal-accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <LinkIcon size={11} /> Field Mapping (@.path)
                                </span>
                                <span
                                  style={{
                                    fontSize: '0.625rem',
                                    color: 'var(--portal-text-muted)',
                                    fontFamily: 'var(--font-mono)',
                                  }}
                                >
                                  RFC 9535
                                </span>
                              </div>

                              {/* Detected API Record Keys Pills */}
                              {liveFormValues[selectedNode.id + '_available_keys'] &&
                                (liveFormValues[selectedNode.id + '_available_keys'] as string[])
                                  .length > 0 && (
                                  <div
                                    style={{
                                      background: 'var(--portal-surface-elevated)',
                                      padding: '5px 8px',
                                      borderRadius: 'var(--radius-sm)',
                                      border: '1px solid var(--portal-border)',
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: '0.625rem',
                                        color: 'var(--portal-text-muted)',
                                        marginBottom: '3px',
                                      }}
                                    >
                                      Detected Record Properties:
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                      {(
                                        liveFormValues[
                                          selectedNode.id + '_available_keys'
                                        ] as string[]
                                      ).map((k) => (
                                        <button
                                          key={k}
                                          type="button"
                                          onClick={() => {
                                            const current = selectedNode.props.fieldMappings || {};
                                            if (!current.title || current.title === '@.title') {
                                              updateNodeProperty('fieldMappings', {
                                                ...current,
                                                title: `@.${k}`,
                                              });
                                            } else if (
                                              !current.content ||
                                              current.content === '@.content'
                                            ) {
                                              updateNodeProperty('fieldMappings', {
                                                ...current,
                                                content: `@.${k}`,
                                              });
                                            }
                                          }}
                                          title={`Click to map to Title or Content slot`}
                                          style={{
                                            fontSize: '0.625rem',
                                            fontFamily: 'var(--font-mono)',
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            color: 'var(--portal-accent)',
                                            padding: '1px 6px',
                                            borderRadius: '3px',
                                            border: '1px solid rgba(59, 130, 246, 0.25)',
                                            cursor: 'pointer',
                                          }}
                                        >
                                          @{'.'}
                                          {k}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              {/* Slot 1: Title Slot */}
                              <div>
                                <label
                                  htmlFor="input-mapping-title"
                                  style={{
                                    fontSize: '0.675rem',
                                    fontWeight: 600,
                                    color: 'var(--portal-text-secondary)',
                                    display: 'block',
                                    marginBottom: '2px',
                                  }}
                                >
                                  Item Title Slot (e.g. @.title, @.question, @.heading)
                                </label>
                                <input
                                  id="input-mapping-title"
                                  type="text"
                                  placeholder="@.title"
                                  value={selectedNode.props.fieldMappings?.title || '@.title'}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const current = selectedNode.props.fieldMappings || {};
                                    updateNodeProperty('fieldMappings', { ...current, title: val });
                                  }}
                                  style={{
                                    width: '100%',
                                    background: 'var(--portal-surface-elevated)',
                                    border: '1px solid var(--portal-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '4px 8px',
                                    color: 'var(--portal-text-primary)',
                                    fontSize: '0.725rem',
                                    fontFamily: 'var(--font-mono)',
                                  }}
                                />
                              </div>

                              {/* Slot 2: Content Slot */}
                              <div>
                                <label
                                  htmlFor="input-mapping-content"
                                  style={{
                                    fontSize: '0.675rem',
                                    fontWeight: 600,
                                    color: 'var(--portal-text-secondary)',
                                    display: 'block',
                                    marginBottom: '2px',
                                  }}
                                >
                                  Item Content Slot (e.g. @.content, @.answer, @.body)
                                </label>
                                <input
                                  id="input-mapping-content"
                                  type="text"
                                  placeholder="@.content"
                                  value={selectedNode.props.fieldMappings?.content || '@.content'}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const current = selectedNode.props.fieldMappings || {};
                                    updateNodeProperty('fieldMappings', {
                                      ...current,
                                      content: val,
                                    });
                                  }}
                                  style={{
                                    width: '100%',
                                    background: 'var(--portal-surface-elevated)',
                                    border: '1px solid var(--portal-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '4px 8px',
                                    color: 'var(--portal-text-primary)',
                                    fontSize: '0.725rem',
                                    fontFamily: 'var(--font-mono)',
                                  }}
                                />
                              </div>

                              {/* Slot 3: Item ID Slot */}
                              <div>
                                <label
                                  htmlFor="input-mapping-id"
                                  style={{
                                    fontSize: '0.675rem',
                                    fontWeight: 600,
                                    color: 'var(--portal-text-secondary)',
                                    display: 'block',
                                    marginBottom: '2px',
                                  }}
                                >
                                  Item Key / ID Slot (e.g. @.id, @.policyId, @.code)
                                </label>
                                <input
                                  id="input-mapping-id"
                                  type="text"
                                  placeholder="@.id"
                                  value={selectedNode.props.fieldMappings?.id || '@.id'}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const current = selectedNode.props.fieldMappings || {};
                                    updateNodeProperty('fieldMappings', { ...current, id: val });
                                  }}
                                  style={{
                                    width: '100%',
                                    background: 'var(--portal-surface-elevated)',
                                    border: '1px solid var(--portal-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '4px 8px',
                                    color: 'var(--portal-text-primary)',
                                    fontSize: '0.725rem',
                                    fontFamily: 'var(--font-mono)',
                                  }}
                                />
                              </div>

                              {/* Slot 4: Icon Slot */}
                              <div>
                                <label
                                  htmlFor="input-mapping-icon"
                                  style={{
                                    fontSize: '0.675rem',
                                    fontWeight: 600,
                                    color: 'var(--portal-text-secondary)',
                                    display: 'block',
                                    marginBottom: '2px',
                                  }}
                                >
                                  Icon / Badge Slot (e.g. @.icon, @.iconName)
                                </label>
                                <input
                                  id="input-mapping-icon"
                                  type="text"
                                  placeholder="@.icon"
                                  value={selectedNode.props.fieldMappings?.icon || '@.icon'}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const current = selectedNode.props.fieldMappings || {};
                                    updateNodeProperty('fieldMappings', { ...current, icon: val });
                                  }}
                                  style={{
                                    width: '100%',
                                    background: 'var(--portal-surface-elevated)',
                                    border: '1px solid var(--portal-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '4px 8px',
                                    color: 'var(--portal-text-primary)',
                                    fontSize: '0.725rem',
                                    fontFamily: 'var(--font-mono)',
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* If Static JSON Mode */}
                        {(selectedNode.props.dataSource || 'static') === 'static' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <label
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  color: 'var(--portal-text-secondary)',
                                }}
                              >
                                Items JSON (
                                {Array.isArray(selectedNode.props.items)
                                  ? selectedNode.props.items.length
                                  : 0}{' '}
                                items)
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  updateNodeProperty('items', [
                                    {
                                      id: 'item-1',
                                      title: 'Security Clearance & Background Check',
                                      content:
                                        'Dual-approval required for root access. Background verification logged in audit registry.',
                                      icon: 'ShieldCheck',
                                    },
                                    {
                                      id: 'item-2',
                                      title: 'Employment Terms & Compliance Agreement',
                                      content:
                                        'Standard enterprise non-disclosure agreement, intellectual property assignment, and automated compliance provisions apply.',
                                      icon: 'FileText',
                                    },
                                    {
                                      id: 'item-3',
                                      title: 'Access Roles & Permissions Matrix',
                                      content:
                                        'Granular RBAC privileges enforced by OpenPolicyAgent with least-privilege delegation and multi-factor approval requirements.',
                                      icon: 'Lock',
                                    },
                                  ]);
                                  setAccordionJsonDraft('');
                                }}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--portal-accent)',
                                  fontSize: '0.675rem',
                                  cursor: 'pointer',
                                  textDecoration: 'underline',
                                }}
                              >
                                Reset Template
                              </button>
                            </div>

                            <textarea
                              rows={6}
                              value={
                                accordionJsonDraft !== ''
                                  ? accordionJsonDraft
                                  : JSON.stringify(selectedNode.props.items || [], null, 2)
                              }
                              onChange={(e) => {
                                setAccordionJsonDraft(e.target.value);
                                setAccordionJsonError(null);
                              }}
                              style={{
                                width: '100%',
                                background: 'var(--portal-surface-elevated)',
                                border:
                                  '1px solid ' +
                                  (accordionJsonError
                                    ? 'var(--portal-error)'
                                    : 'var(--portal-border)'),
                                borderRadius: 'var(--radius-sm)',
                                padding: '6px',
                                color: 'var(--portal-text-primary)',
                                fontSize: '0.7rem',
                                fontFamily: 'var(--font-mono)',
                                lineHeight: '1.4',
                                resize: 'vertical',
                              }}
                            />

                            {accordionJsonError && (
                              <div
                                style={{
                                  fontSize: '0.7rem',
                                  color: 'var(--portal-error)',
                                }}
                              >
                                {accordionJsonError}
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                try {
                                  const textToParse =
                                    accordionJsonDraft !== ''
                                      ? accordionJsonDraft
                                      : JSON.stringify(selectedNode.props.items || []);
                                  const parsed = JSON.parse(textToParse);
                                  if (!Array.isArray(parsed)) {
                                    throw new Error('Root JSON must be an array of items');
                                  }
                                  updateNodeProperty('items', parsed);
                                  setAccordionJsonDraft(JSON.stringify(parsed, null, 2));
                                  setAccordionJsonError(null);
                                } catch (err: any) {
                                  setAccordionJsonError(err.message);
                                }
                              }}
                              style={{
                                background: 'var(--portal-surface-hover)',
                                border: '1px solid var(--portal-border)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '5px 8px',
                                fontSize: '0.725rem',
                                fontWeight: 600,
                                color: 'var(--portal-text-primary)',
                                cursor: 'pointer',
                              }}
                            >
                              Format & Apply JSON
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* TAB 2: GRID & POSITION MOVEMENT */}
              {inspectorTab === 'grid' && (
                <>
                  <div
                    style={{
                      background: 'var(--portal-surface-elevated)',
                      border: '1px solid var(--portal-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.65rem',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--portal-accent)',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <Move size={13} />
                      <span>Element Canvas Positioning</span>
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--portal-text-secondary)' }}>
                      Adjust column width and horizontal position across the 12-column grid.
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <label
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--portal-text-secondary)',
                        }}
                      >
                        Column Span (1–12)
                      </label>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--portal-accent)',
                        }}
                      >
                        {selectedNode?.layout?.colSpan || 6} Columns
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={selectedNode?.layout?.colSpan || 6}
                      onChange={(e) => updateNodeLayout('colSpan', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--portal-text-secondary)',
                        display: 'block',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Width Presets
                    </label>
                    <div
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}
                    >
                      <button
                        onClick={() => updateNodeLayout('colSpan', 6)}
                        style={{
                          background:
                            selectedNode?.layout?.colSpan === 6
                              ? 'var(--portal-accent)'
                              : 'var(--portal-surface-elevated)',
                          color:
                            selectedNode?.layout?.colSpan === 6
                              ? '#fff'
                              : 'var(--portal-text-primary)',
                          border: '1px solid var(--portal-border)',
                          padding: '4px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                        }}
                      >
                        50% (6 Col)
                      </button>
                      <button
                        onClick={() => updateNodeLayout('colSpan', 12)}
                        style={{
                          background:
                            selectedNode?.layout?.colSpan === 12
                              ? 'var(--portal-accent)'
                              : 'var(--portal-surface-elevated)',
                          color:
                            selectedNode?.layout?.colSpan === 12
                              ? '#fff'
                              : 'var(--portal-text-primary)',
                          border: '1px solid var(--portal-border)',
                          padding: '4px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                        }}
                      >
                        100% (12 Col)
                      </button>
                      <button
                        onClick={() => updateNodeLayout('colSpan', 4)}
                        style={{
                          background:
                            selectedNode?.layout?.colSpan === 4
                              ? 'var(--portal-accent)'
                              : 'var(--portal-surface-elevated)',
                          color:
                            selectedNode?.layout?.colSpan === 4
                              ? '#fff'
                              : 'var(--portal-text-primary)',
                          border: '1px solid var(--portal-border)',
                          padding: '4px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                        }}
                      >
                        33% (4 Col)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--portal-text-secondary)',
                        display: 'block',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Column Start Offset (Horizontal Move)
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => {
                          const current = selectedNode?.layout?.colStart || 1;
                          if (current > 1) updateNodeLayout('colStart', current - 1);
                        }}
                        disabled={(selectedNode?.layout?.colStart || 1) <= 1}
                        style={{
                          flex: 1,
                          background: 'var(--portal-surface-elevated)',
                          border: '1px solid var(--portal-border)',
                          color: 'var(--portal-text-primary)',
                          padding: '6px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.725rem',
                          cursor:
                            (selectedNode?.layout?.colStart || 1) <= 1 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                        }}
                      >
                        <ArrowLeft size={12} /> Nudge Left
                      </button>

                      <button
                        onClick={() => {
                          const current = selectedNode?.layout?.colStart || 1;
                          const span = selectedNode?.layout?.colSpan || 6;
                          if (current + span <= 13) updateNodeLayout('colStart', current + 1);
                        }}
                        disabled={
                          (selectedNode?.layout?.colStart || 1) +
                            (selectedNode?.layout?.colSpan || 6) >=
                          13
                        }
                        style={{
                          flex: 1,
                          background: 'var(--portal-surface-elevated)',
                          border: '1px solid var(--portal-border)',
                          color: 'var(--portal-text-primary)',
                          padding: '6px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.725rem',
                          cursor:
                            (selectedNode?.layout?.colStart || 1) +
                              (selectedNode?.layout?.colSpan || 6) >=
                            13
                              ? 'not-allowed'
                              : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                        }}
                      >
                        Nudge Right <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 3: DEVELOPER DATA BINDING */}
              {inspectorTab === 'binding' && (
                <>
                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.12))',
                      border: '1px solid var(--portal-accent)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--portal-accent)',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <Code2 size={13} />
                      <span>Developer Tier: RFC 9535 Mapping</span>
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--portal-text-secondary)' }}>
                      Map this HeroUI component to upstream backend mutations and query paths.
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--portal-text-secondary)',
                        display: 'block',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Target API Operation
                    </label>
                    <select
                      value={selectedNode?.binding?.operation || 'POST /api/employees'}
                      onChange={(e) => updateNodeBinding('operation', e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--portal-surface-elevated)',
                        border: '1px solid var(--portal-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 8px',
                        color: 'var(--portal-text-primary)',
                        fontSize: '0.75rem',
                        outline: 'none',
                      }}
                    >
                      <option value="POST /api/employees">
                        POST /api/employees (Create Employee)
                      </option>
                      <option value="PUT /api/employees/:id">
                        PUT /api/employees/:id (Update Record)
                      </option>
                      <option value="GET /api/employees">
                        GET /api/employees (Query Collection)
                      </option>
                      <option value="POST /api/departments">
                        POST /api/departments (Dispatch Dept)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--portal-text-secondary)',
                        display: 'block',
                        marginBottom: '0.35rem',
                      }}
                    >
                      JSONPath Binding Path ($-Rooted)
                    </label>
                    <input
                      type="text"
                      value={selectedNode?.binding?.path || '$.data.customField'}
                      onChange={(e) => updateNodeBinding('path', e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--portal-surface-elevated)',
                        border: '1px solid var(--portal-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 8px',
                        color: 'var(--portal-accent)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                      }}
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: '0.725rem',
                        fontWeight: 600,
                        color: 'var(--portal-text-secondary)',
                        marginBottom: '4px',
                      }}
                    >
                      Outbound Mutation Payload Preview
                    </div>
                    <pre
                      style={{
                        background: 'var(--portal-surface-elevated)',
                        border: '1px solid var(--portal-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px',
                        fontSize: '0.675rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--portal-text-primary)',
                        overflowX: 'auto',
                      }}
                    >
                      {JSON.stringify(
                        {
                          operation: selectedNode?.binding?.operation || 'POST /api/employees',
                          field: selectedNode?.binding?.field || 'unknown',
                          path: selectedNode?.binding?.path || '$.data',
                          previewValue:
                            selectedNode?.props?.placeholder ||
                            selectedNode?.props?.label ||
                            'sample',
                        },
                        null,
                        2,
                      )}
                    </pre>
                  </div>

                  <button
                    onClick={() => {
                      alert(
                        `[Phase 5 Dry-Run Success]: Synthesized payload verified against Axum Platform API schema:\n${JSON.stringify(
                          {
                            endpoint: selectedNode?.binding?.operation || 'POST /api/employees',
                            boundPath: selectedNode?.binding?.path || '$.data',
                            status: '200 OK (Simulated)',
                          },
                          null,
                          2,
                        )}`,
                      );
                    }}
                    style={{
                      background: 'var(--portal-surface-elevated)',
                      border: '1px solid var(--portal-accent)',
                      color: 'var(--portal-accent)',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Database size={13} /> Test Upstream Mutation
                  </button>
                </>
              )}

              {/* TAB 4: RBAC PERMISSIONS */}
              {inspectorTab === 'permissions' && (
                <>
                  <div
                    style={{
                      background: 'var(--portal-surface-elevated)',
                      border: '1px solid var(--portal-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--portal-text-muted)',
                        marginBottom: '4px',
                      }}
                    >
                      Server-Enforced Access (Tier 2)
                    </div>
                    <div
                      style={{
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        color: 'var(--portal-warning)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Lock size={13} /> Keycloak RBAC Verification
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--portal-text-secondary)',
                        display: 'block',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Required Permission Identifiers
                    </label>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.725rem',
                          fontFamily: 'var(--font-mono)',
                          background: 'rgba(59, 130, 246, 0.15)',
                          color: 'var(--portal-accent)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        employees.write
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Live Form Submission Success Modal in Preview Mode */}
      {submittedPreviewData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setSubmittedPreviewData(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '540px',
              maxWidth: '90vw',
              background: 'var(--portal-surface)',
              border: '1px solid var(--portal-success)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--portal-border)',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--portal-success)' }} />
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    margin: 0,
                    color: 'var(--portal-text-primary)',
                  }}
                >
                  Form Submitted (Preview Simulation)
                </h3>
              </div>
              <button
                onClick={() => setSubmittedPreviewData(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--portal-text-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <p
                style={{
                  fontSize: '0.825rem',
                  color: 'var(--portal-text-secondary)',
                  marginBottom: '0.75rem',
                }}
              >
                Verified mutation payload constructed from interactive live inputs:
              </p>
              <pre
                style={{
                  background: 'var(--portal-surface-elevated)',
                  border: '1px solid var(--portal-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--portal-success)',
                  overflowX: 'auto',
                }}
              >
                {JSON.stringify(submittedPreviewData, null, 2)}
              </pre>
            </div>
            <div
              style={{
                padding: '0.75rem 1.25rem',
                borderTop: '1px solid var(--portal-border)',
                background: 'var(--portal-surface-elevated)',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setSubmittedPreviewData(null)}
                style={{
                  background: 'var(--portal-accent)',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close Dialog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3-Tier Administrator Component Governance Modal (All 72 Components) */}
      {showAdminGovernanceModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setShowAdminGovernanceModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '780px',
              maxWidth: '95vw',
              maxHeight: '85vh',
              background: 'var(--portal-surface)',
              border: '1px solid var(--portal-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--portal-success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: 'var(--portal-text-primary)',
                      margin: 0,
                    }}
                  >
                    Administrator Component Governance
                  </h3>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--portal-text-muted)',
                      margin: '2px 0 0',
                    }}
                  >
                    Tier 1 Governance: Configure which of the {totalCount} HeroUI v3 components are
                    permitted in this project.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminGovernanceModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--portal-text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                padding: '0.65rem 1.25rem',
                borderBottom: '1px solid var(--portal-border)',
                background: 'var(--portal-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--portal-text-secondary)' }}>
                {allowedCount} of {totalCount} components allowed for canvas placement
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => {
                    const allAllowed: Record<string, boolean> = {};
                    COMPLETE_HERO_UI_CATALOG.forEach((c) => (allAllowed[c.type] = true));
                    setAdminAllowedComponents(allAllowed);
                  }}
                  style={{
                    background: 'var(--portal-surface-elevated)',
                    border: '1px solid var(--portal-border)',
                    color: 'var(--portal-text-primary)',
                    fontSize: '0.7rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                  }}
                >
                  Allow All
                </button>
                <button
                  onClick={() => {
                    const restrictedExperimental: Record<string, boolean> = {};
                    COMPLETE_HERO_UI_CATALOG.forEach((c) => {
                      restrictedExperimental[c.type] =
                        c.badge !== 'New' && c.type !== 'Autocomplete' && c.type !== 'InputOTP';
                    });
                    setAdminAllowedComponents(restrictedExperimental);
                  }}
                  style={{
                    background: 'var(--portal-surface-elevated)',
                    border: '1px solid var(--portal-border)',
                    color: 'var(--portal-warning)',
                    fontSize: '0.7rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                  }}
                >
                  Restrict Experimental
                </button>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem 1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.65rem',
              }}
            >
              {COMPLETE_HERO_UI_CATALOG.map((item) => {
                const IconComp = item.icon;
                const isAllowed = adminAllowedComponents[item.type] !== false;

                return (
                  <div
                    key={item.type}
                    style={{
                      background: 'var(--portal-surface-elevated)',
                      border: `1px solid ${isAllowed ? 'var(--portal-border)' : 'rgba(245, 158, 11, 0.4)'}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IconComp
                        size={16}
                        style={{
                          color: isAllowed ? 'var(--portal-accent)' : 'var(--portal-text-muted)',
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: isAllowed
                              ? 'var(--portal-text-primary)'
                              : 'var(--portal-text-muted)',
                          }}
                        >
                          {item.type}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--portal-text-muted)' }}>
                          {item.category}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setAdminAllowedComponents((prev) => ({
                          ...prev,
                          [item.type]: !isAllowed,
                        }))
                      }
                      style={{
                        background: isAllowed
                          ? 'var(--portal-success)'
                          : 'var(--portal-surface-hover)',
                        border: '1px solid var(--portal-border)',
                        color: isAllowed ? '#fff' : 'var(--portal-text-muted)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isAllowed ? (
                        <>
                          <Check size={11} /> Allowed
                        </>
                      ) : (
                        <>
                          <Lock size={11} /> Restricted
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                padding: '0.85rem 1.25rem',
                borderTop: '1px solid var(--portal-border)',
                background: 'var(--portal-surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowAdminGovernanceModal(false)}
                style={{
                  background: 'var(--portal-accent)',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Apply Governance Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Sitemap Page Modal */}
      {showNewPageModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setShowNewPageModal(false)}
        >
          <div
            style={{
              width: '420px',
              maxWidth: '95vw',
              background: 'var(--portal-surface)',
              border: '1px solid var(--portal-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderTree size={18} style={{ color: 'var(--portal-accent)' }} />
                <h3
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    margin: 0,
                    color: 'var(--portal-text-primary)',
                  }}
                >
                  Create New Sitemap Page
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewPageModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--portal-text-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={handleCreateNewPage}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div>
                <label
                  htmlFor="input-new-page-title"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--portal-text-secondary)',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Page Title
                </label>
                <input
                  id="input-new-page-title"
                  type="text"
                  required
                  placeholder="e.g. Employee Perks & Benefits"
                  value={newPageTitle}
                  onChange={(e) => {
                    const title = e.target.value;
                    setNewPageTitle(title);
                    if (!newPageRoute || newPageRoute.startsWith('/')) {
                      setNewPageRoute(
                        '/' +
                          title
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, '-'),
                      );
                    }
                  }}
                  style={{
                    width: '100%',
                    background: 'var(--portal-surface-elevated)',
                    border: '1px solid var(--portal-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '7px 10px',
                    fontSize: '0.8rem',
                    color: 'var(--portal-text-primary)',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="input-new-page-route"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--portal-text-secondary)',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Route Path
                </label>
                <input
                  id="input-new-page-route"
                  type="text"
                  required
                  placeholder="/perks-benefits"
                  value={newPageRoute}
                  onChange={(e) => setNewPageRoute(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--portal-surface-elevated)',
                    border: '1px solid var(--portal-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '7px 10px',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--portal-text-primary)',
                    outline: 'none',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '8px',
                  marginTop: '0.5rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowNewPageModal(false)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--portal-border)',
                    background: 'transparent',
                    color: 'var(--portal-text-secondary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-create-page"
                  type="submit"
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: 'var(--portal-accent)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Create & Open Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Status Bar */}
      {!isPreviewMode && (
        <footer
          style={{
            height: 'var(--footer-height)',
            background: 'var(--portal-surface)',
            borderTop: '1px solid var(--portal-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1rem',
            fontSize: '0.7rem',
            color: 'var(--portal-text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Form Fields: {formFields.length}</span>
            <span>Selected: {selectedNodeId}</span>
            <span>
              Admin Allowed: {allowedCount}/{totalCount}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Grid: 12 Col</span>
            <span>Dir: {direction.toUpperCase()}</span>
            <span>All {totalCount} HeroUI Components Available</span>
          </div>
        </footer>
      )}
    </div>
  );
}

// Helper to Render Any of the 72 HeroUI Components Dynamically
function renderHeroUIComponent(
  field: any,
  isPreviewMode: boolean,
  liveFormValues: Record<string, any>,
  setLiveFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>,
) {
  const currentValue = liveFormValues[field.id];

  // 1. Text Inputs & Variants
  if (field.type === 'Input' || field.type === 'TextField') {
    return (
      <div>
        <label
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--portal-text-primary)',
            display: 'block',
            marginBottom: '3px',
          }}
        >
          {field.props.label || 'Input Field'}
          {field.props.required && <span style={{ color: 'var(--portal-error)' }}> *</span>}
        </label>
        <input
          type="text"
          placeholder={field.props.placeholder}
          value={currentValue !== undefined ? currentValue : field.props.placeholder || ''}
          readOnly={!isPreviewMode}
          onChange={(e) =>
            setLiveFormValues((prev) => ({
              ...prev,
              [field.id]: e.target.value,
            }))
          }
          style={{
            width: '100%',
            background: 'var(--portal-surface-elevated)',
            border: '1px solid var(--portal-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px',
            fontSize: '0.8rem',
            color: 'var(--portal-text-primary)',
            outline: isPreviewMode ? undefined : 'none',
          }}
        />
        {field.props.description && (
          <div style={{ fontSize: '0.65rem', color: 'var(--portal-text-muted)', marginTop: '2px' }}>
            {field.props.description}
          </div>
        )}
      </div>
    );
  }

  // 2. TextArea
  if (field.type === 'TextArea') {
    return (
      <div>
        <label
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--portal-text-primary)',
            display: 'block',
            marginBottom: '3px',
          }}
        >
          {field.props.label || 'Text Area'}
        </label>
        <textarea
          rows={field.props.rows || 3}
          placeholder={field.props.placeholder}
          value={currentValue !== undefined ? currentValue : ''}
          readOnly={!isPreviewMode}
          onChange={(e) =>
            setLiveFormValues((prev) => ({
              ...prev,
              [field.id]: e.target.value,
            }))
          }
          style={{
            width: '100%',
            background: 'var(--portal-surface-elevated)',
            border: '1px solid var(--portal-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px',
            fontSize: '0.8rem',
            color: 'var(--portal-text-primary)',
            outline: isPreviewMode ? undefined : 'none',
          }}
        />
      </div>
    );
  }

  // 3. NumberField
  if (field.type === 'NumberField') {
    return (
      <div>
        <label
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--portal-text-primary)',
            display: 'block',
            marginBottom: '3px',
          }}
        >
          {field.props.label || 'Number Field'}
        </label>
        <input
          type="number"
          min={field.props.min}
          max={field.props.max}
          value={currentValue !== undefined ? currentValue : field.props.value || 0}
          readOnly={!isPreviewMode}
          onChange={(e) =>
            setLiveFormValues((prev) => ({
              ...prev,
              [field.id]: Number(e.target.value),
            }))
          }
          style={{
            width: '100%',
            background: 'var(--portal-surface-elevated)',
            border: '1px solid var(--portal-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px',
            fontSize: '0.8rem',
            color: 'var(--portal-text-primary)',
          }}
        />
      </div>
    );
  }

  // 4. InputGroup
  if (field.type === 'InputGroup') {
    return (
      <div>
        <label
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--portal-text-primary)',
            display: 'block',
            marginBottom: '3px',
          }}
        >
          {field.props.label || 'Input Group'}
        </label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {field.props.prefix && (
            <span
              style={{
                background: 'var(--portal-surface)',
                border: '1px solid var(--portal-border)',
                borderInlineEnd: 'none',
                padding: '6px 10px',
                fontSize: '0.8rem',
                color: 'var(--portal-text-muted)',
                borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
              }}
            >
              {field.props.prefix}
            </span>
          )}
          <input
            type="text"
            placeholder={field.props.placeholder}
            value={currentValue !== undefined ? currentValue : ''}
            readOnly={!isPreviewMode}
            onChange={(e) =>
              setLiveFormValues((prev) => ({
                ...prev,
                [field.id]: e.target.value,
              }))
            }
            style={{
              flex: 1,
              background: 'var(--portal-surface-elevated)',
              border: '1px solid var(--portal-border)',
              padding: '6px 10px',
              fontSize: '0.8rem',
              color: 'var(--portal-text-primary)',
            }}
          />
          {field.props.suffix && (
            <span
              style={{
                background: 'var(--portal-surface)',
                border: '1px solid var(--portal-border)',
                borderInlineStart: 'none',
                padding: '6px 10px',
                fontSize: '0.75rem',
                color: 'var(--portal-text-muted)',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              }}
            >
              {field.props.suffix}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 5. InputOTP
  if (field.type === 'InputOTP') {
    return (
      <div>
        <label
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--portal-text-primary)',
            display: 'block',
            marginBottom: '4px',
          }}
        >
          {field.props.label || 'One-Time Passcode'}
        </label>
        <div style={{ display: 'flex', gap: '6px' }}>
          {Array.from({ length: field.props.length || 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '36px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--portal-border)',
                background: 'var(--portal-surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--portal-accent)',
              }}
            >
              {i < 3 ? '•' : ''}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. SearchField
  if (field.type === 'SearchField' || field.type === 'Autocomplete' || field.type === 'ComboBox') {
    return (
      <div>
        <label
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--portal-text-primary)',
            display: 'block',
            marginBottom: '3px',
          }}
        >
          {field.props.label || field.type}
        </label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--portal-surface-elevated)',
            border: '1px solid var(--portal-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px',
            fontSize: '0.8rem',
            color: 'var(--portal-text-muted)',
            gap: '6px',
          }}
        >
          <Search size={13} />
          <input
            type="text"
            placeholder={field.props.placeholder || 'Type to search...'}
            value={currentValue !== undefined ? currentValue : ''}
            readOnly={!isPreviewMode}
            onChange={(e) =>
              setLiveFormValues((prev) => ({
                ...prev,
                [field.id]: e.target.value,
              }))
            }
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: '0.8rem',
              color: 'var(--portal-text-primary)',
            }}
          />
        </div>
      </div>
    );
  }

  // 7. Select Dropdown
  if (field.type === 'Select') {
    return (
      <div>
        <label
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--portal-text-primary)',
            display: 'block',
            marginBottom: '3px',
          }}
        >
          {field.props.label || 'Select Dropdown'}
        </label>
        {isPreviewMode ? (
          <select
            value={currentValue || field.props.options?.[0] || ''}
            onChange={(e) =>
              setLiveFormValues((prev) => ({
                ...prev,
                [field.id]: e.target.value,
              }))
            }
            style={{
              width: '100%',
              background: 'var(--portal-surface-elevated)',
              border: '1px solid var(--portal-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 10px',
              fontSize: '0.8rem',
              color: 'var(--portal-text-primary)',
            }}
          >
            {(field.props.options || []).map((opt: string) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--portal-surface-elevated)',
              border: '1px solid var(--portal-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 10px',
              fontSize: '0.8rem',
              color: 'var(--portal-text-primary)',
            }}
          >
            <span>{field.props.options?.[0] || 'Choose an option...'}</span>
            <ChevronDown size={14} style={{ color: 'var(--portal-text-muted)' }} />
          </div>
        )}
      </div>
    );
  }

  // 8. Date & Calendar Pickers (HeroUI v3 High-Fidelity DatePicker & DateRangePicker)
  if (
    field.type === 'Calendar' ||
    field.type === 'DatePicker' ||
    field.type === 'DateRangePicker' ||
    field.type === 'DateField' ||
    field.type === 'RangeCalendar'
  ) {
    const isRange = field.type === 'DateRangePicker' || field.type === 'RangeCalendar';
    const isInlineCalendar = field.type === 'Calendar' || field.type === 'RangeCalendar';
    const isFlyoutOpen = isInlineCalendar || !!liveFormValues[field.id + '_flyout'];

    // Current range / single date selection
    const rangeStart = liveFormValues[field.id + '_start'] || 19;
    const rangeEnd = liveFormValues[field.id + '_end'] || 25;
    const singleDate = liveFormValues[field.id] || 25;

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // 35 days grid matching October 2026 exactly as shown in HeroUI documentation
    const calendarDays = [
      { day: 28, isPrevMonth: true },
      { day: 29, isPrevMonth: true },
      { day: 30, isPrevMonth: true },
      { day: 1 },
      { day: 2 },
      { day: 3 },
      { day: 4 },
      { day: 5 },
      { day: 6 },
      { day: 7 },
      { day: 8 },
      { day: 9 },
      { day: 10 },
      { day: 11 },
      { day: 12 },
      { day: 13 },
      { day: 14 },
      { day: 15 },
      { day: 16 },
      { day: 17 },
      { day: 18 },
      { day: 19 },
      { day: 20 },
      { day: 21 },
      { day: 22 },
      { day: 23 },
      { day: 24 },
      { day: 25 },
      { day: 26 },
      { day: 27 },
      { day: 28 },
      { day: 29 },
      { day: 30 },
      { day: 31 },
      { day: 1, isNextMonth: true },
    ];

    const toggleFlyout = (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setLiveFormValues((prev) => ({
        ...prev,
        [field.id + '_flyout']: !prev[field.id + '_flyout'],
      }));
    };

    const handleSelectDay = (
      dayObj: { day: number; isPrevMonth?: boolean; isNextMonth?: boolean },
      e: React.MouseEvent,
    ) => {
      e.stopPropagation();
      if (dayObj.isPrevMonth || dayObj.isNextMonth) return;
      if (isRange) {
        if (dayObj.day < rangeStart || rangeStart !== rangeEnd) {
          setLiveFormValues((prev) => ({
            ...prev,
            [field.id + '_start']: dayObj.day,
            [field.id + '_end']: dayObj.day,
          }));
        } else {
          setLiveFormValues((prev) => ({
            ...prev,
            [field.id + '_start']: Math.min(rangeStart, dayObj.day),
            [field.id + '_end']: Math.max(rangeStart, dayObj.day),
          }));
        }
      } else {
        setLiveFormValues((prev) => ({
          ...prev,
          [field.id]: dayObj.day,
        }));
      }
    };

    return (
      <div style={{ position: 'relative' }}>
        {/* Label and Flyout Preview Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}
        >
          <label
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--portal-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{field.props.label || (isRange ? 'Date Range' : 'Date Selection')}</span>
            {field.props.required && <span style={{ color: 'var(--portal-error)' }}>*</span>}
          </label>
          {!isInlineCalendar && !isPreviewMode && (
            <button
              type="button"
              onClick={toggleFlyout}
              title="Toggle HeroUI Calendar Popover Flyout"
              style={{
                background: isFlyoutOpen ? 'rgba(59, 130, 246, 0.15)' : 'var(--portal-surface)',
                border:
                  '1px solid ' + (isFlyoutOpen ? 'var(--portal-accent)' : 'var(--portal-border)'),
                color: isFlyoutOpen ? 'var(--portal-accent)' : 'var(--portal-text-muted)',
                borderRadius: 'var(--radius-sm)',
                padding: '1px 6px',
                fontSize: '0.625rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <CalendarIcon size={10} />
              <span>{isFlyoutOpen ? 'Close Popover' : 'Preview Popover'}</span>
            </button>
          )}
        </div>

        {/* Input Trigger (for DatePicker, DateRangePicker, DateField) */}
        {!isInlineCalendar && (
          <div
            onClick={toggleFlyout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--portal-surface-elevated)',
              border: isFlyoutOpen
                ? '1px solid var(--portal-accent)'
                : '1px solid var(--portal-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 10px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease',
              boxShadow: isFlyoutOpen ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
            }}
          >
            {isRange ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.775rem',
                  color: 'var(--portal-text-secondary)',
                }}
              >
                <span>{`${String(rangeStart).padStart(2, '0')} / 10 / 2026`}</span>
                <span style={{ color: 'var(--portal-text-muted)' }}>–</span>
                <span>{`${String(rangeEnd).padStart(2, '0')} / 10 / 2026`}</span>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.775rem',
                  color: 'var(--portal-text-secondary)',
                }}
              >
                <span>
                  {singleDate
                    ? `${String(singleDate).padStart(2, '0')} / 10 / 2026`
                    : 'dd / mm / yyyy'}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={toggleFlyout}
              title="Open Calendar Popover"
              style={{
                background: 'transparent',
                border: 'none',
                color: isFlyoutOpen ? 'var(--portal-accent)' : 'var(--portal-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
            >
              <CalendarIcon size={14} />
            </button>
          </div>
        )}

        {/* HeroUI v3 Calendar Card / Popover Flyout */}
        {(isInlineCalendar || isFlyoutOpen) && (
          <div
            style={{
              position: isInlineCalendar ? 'relative' : 'absolute',
              top: isInlineCalendar ? 'auto' : 'calc(100% + 6px)',
              left: isInlineCalendar ? 'auto' : 0,
              zIndex: 100,
              width: '100%',
              maxWidth: '310px',
              background: 'var(--portal-surface-elevated)',
              border: '1px solid var(--portal-border)',
              borderRadius: '16px',
              padding: '14px 16px',
              boxShadow: isInlineCalendar
                ? '0 2px 8px rgba(0, 0, 0, 0.15)'
                : '0 24px 60px -8px rgba(0, 0, 0, 0.45), 0 0 0 1px var(--portal-border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Month/Year and Chevrons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--portal-text-primary)',
                  cursor: 'pointer',
                }}
              >
                <span>October 2026</span>
                <ChevronRight size={13} style={{ color: 'var(--portal-text-muted)' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  type="button"
                  title="Previous Month"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--portal-text-secondary)',
                    padding: '3px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <ChevronLeft size={13} />
                </button>
                <button
                  type="button"
                  title="Next Month"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--portal-text-secondary)',
                    padding: '3px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* Weekday Names */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                textAlign: 'center',
                fontSize: '0.7rem',
                fontWeight: 500,
                color: 'var(--portal-text-muted)',
                marginBottom: '6px',
              }}
            >
              {daysOfWeek.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* 35 Days Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                rowGap: '3px',
              }}
            >
              {calendarDays.map((dObj, idx) => {
                const isOverflow = dObj.isPrevMonth || dObj.isNextMonth;
                const d = dObj.day;

                // Range calculations for DateRangePicker / RangeCalendar
                const isInRange = isRange && !isOverflow && d >= rangeStart && d <= rangeEnd;
                const isStart = isRange && !isOverflow && d === rangeStart;
                const isEnd = isRange && !isOverflow && d === rangeEnd;
                const isSingleSelected = !isRange && !isOverflow && d === singleDate;

                // Day container background for continuous range band
                let containerBg = 'transparent';
                let containerRadius = '0';

                if (isRange && isInRange) {
                  containerBg = 'rgba(59, 130, 246, 0.15)';
                  if (isStart && isEnd) {
                    containerRadius = '50%';
                  } else if (isStart) {
                    containerRadius = '50% 0 0 50%';
                  } else if (isEnd) {
                    containerRadius = '0 50% 50% 0';
                  }
                }

                return (
                  <div
                    key={idx}
                    onClick={(e) => handleSelectDay(dObj, e)}
                    style={{
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: containerBg,
                      borderRadius: containerRadius,
                      cursor: isOverflow ? 'default' : 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.775rem',
                        fontWeight:
                          isStart || isEnd || isSingleSelected ? 700 : isInRange ? 600 : 400,
                        background:
                          isStart || isEnd || isSingleSelected
                            ? 'var(--portal-accent)'
                            : 'transparent',
                        color:
                          isStart || isEnd || isSingleSelected
                            ? '#fff'
                            : isOverflow
                              ? 'var(--portal-text-muted)'
                              : isInRange
                                ? 'var(--portal-accent)'
                                : 'var(--portal-text-primary)',
                        opacity: isOverflow ? 0.35 : 1,
                        boxShadow:
                          isStart || isEnd || isSingleSelected
                            ? '0 2px 6px rgba(59, 130, 246, 0.4)'
                            : 'none',
                        transition: 'all 0.1s ease',
                      }}
                    >
                      {d}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 9. TimeField
  if (field.type === 'TimeField') {
    return (
      <div>
        <label
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--portal-text-primary)',
            display: 'block',
            marginBottom: '3px',
          }}
        >
          {field.props.label || 'Time Field'}
        </label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--portal-surface-elevated)',
            border: '1px solid var(--portal-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px',
            fontSize: '0.8rem',
            color: 'var(--portal-text-secondary)',
          }}
        >
          <span>{field.props.value || '09:00 AM'}</span>
          <Clock size={14} style={{ color: 'var(--portal-accent)' }} />
        </div>
      </div>
    );
  }

  // 10. Checkbox & Switch
  if (field.type === 'Checkbox' || field.type === 'Switch') {
    const isChecked = currentValue ?? field.props.checked ?? false;
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 0',
          cursor: isPreviewMode ? 'pointer' : 'default',
        }}
        onClick={() => {
          if (isPreviewMode) {
            setLiveFormValues((prev) => ({
              ...prev,
              [field.id]: !isChecked,
            }));
          }
        }}
      >
        {field.type === 'Switch' ? (
          <div
            style={{
              width: '34px',
              height: '18px',
              borderRadius: '9999px',
              background: isChecked ? 'var(--portal-accent)' : 'var(--portal-border)',
              position: 'relative',
              transition: 'all 0.15s ease',
            }}
          >
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: '2px',
                left: isChecked ? '18px' : '2px',
                transition: 'all 0.15s ease',
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '4px',
              background: isChecked ? 'var(--portal-accent)' : 'transparent',
              border: `1px solid ${isChecked ? 'var(--portal-accent)' : 'var(--portal-border)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            {isChecked && <Check size={11} />}
          </div>
        )}
        <span style={{ fontSize: '0.775rem', color: 'var(--portal-text-primary)' }}>
          {field.props.label || 'Toggle Option'}
        </span>
      </div>
    );
  }

  // 11. CheckboxGroup & SwitchGroup & RadioGroup
  if (
    field.type === 'CheckboxGroup' ||
    field.type === 'SwitchGroup' ||
    field.type === 'RadioGroup'
  ) {
    return (
      <div>
        <label
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--portal-text-primary)',
            display: 'block',
            marginBottom: '4px',
          }}
        >
          {field.props.label || field.type}
        </label>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {(field.props.options || ['Option A', 'Option B']).map((opt: string) => (
            <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: field.type === 'RadioGroup' ? '50%' : '3px',
                  border: '1px solid var(--portal-accent)',
                  background: 'rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--portal-accent)',
                }}
              >
                <Check size={9} />
              </div>
              <span style={{ fontSize: '0.725rem', color: 'var(--portal-text-secondary)' }}>
                {opt}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 12. Slider
  if (field.type === 'Slider') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <label
            style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--portal-text-primary)' }}
          >
            {field.props.label || 'Range Slider'}
          </label>
          <span
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--portal-accent)',
            }}
          >
            {currentValue ?? field.props.value ?? 50}%
          </span>
        </div>
        <input
          type="range"
          min={field.props.min || 0}
          max={field.props.max || 100}
          value={currentValue ?? field.props.value ?? 50}
          disabled={!isPreviewMode}
          onChange={(e) =>
            setLiveFormValues((prev) => ({
              ...prev,
              [field.id]: Number(e.target.value),
            }))
          }
          style={{ width: '100%' }}
        />
      </div>
    );
  }

  // 13. Color Picker & Swatches
  if (
    field.type === 'ColorPicker' ||
    field.type === 'ColorField' ||
    field.type === 'ColorSwatchPicker'
  ) {
    return (
      <div>
        <label
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--portal-text-primary)',
            display: 'block',
            marginBottom: '3px',
          }}
        >
          {field.props.label || 'Color Selection'}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              background: field.props.value || '#3b82f6',
              border: '1px solid var(--portal-border)',
            }}
          />
          <span
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--portal-text-secondary)',
            }}
          >
            {field.props.value || '#3b82f6'}
          </span>
        </div>
      </div>
    );
  }

  // 14. Button & ButtonGroup
  if (field.type === 'Button' || field.type === 'CloseButton' || field.type === 'ToggleButton') {
    return (
      <button
        type={isPreviewMode && field.props.isSubmit ? 'submit' : 'button'}
        style={{
          background: 'var(--portal-accent)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 16px',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        <MousePointer size={14} /> {field.props.label || 'Submit Action'}
      </button>
    );
  }

  // 15. Alert & Toast
  if (field.type === 'Alert' || field.type === 'Toast') {
    return (
      <div
        style={{
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 10px',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start',
        }}
      >
        <AlertCircle size={15} style={{ color: 'var(--portal-warning)', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--portal-warning)' }}>
            {field.props.title || field.type}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--portal-text-secondary)' }}>
            {field.props.message}
          </div>
        </div>
      </div>
    );
  }

  // 16. Form & Fieldset Container
  if (field.type === 'Form' || field.type === 'Fieldset') {
    return (
      <div
        style={{
          background: 'var(--portal-surface-elevated)',
          border: '1px solid var(--portal-border)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
            paddingBottom: '8px',
            borderBottom: '1px solid var(--portal-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: 'var(--portal-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FormInput size={14} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  color: 'var(--portal-text-primary)',
                }}
              >
                {field.props.title || 'Employee Registration Form'}
              </div>
              <div style={{ fontSize: '0.675rem', color: 'var(--portal-text-muted)' }}>
                HeroUI Form Container · Managed Validation &amp; Payload Dispatch
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: '0.65rem',
              background: 'rgba(59, 130, 246, 0.12)',
              color: 'var(--portal-accent)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
            }}
          >
            &lt;Form&gt;
          </span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            marginTop: '10px',
          }}
        >
          <div>
            <label
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'var(--portal-text-secondary)',
                display: 'block',
                marginBottom: '3px',
              }}
            >
              Employee Full Name
            </label>
            <div
              style={{
                background: 'var(--portal-surface)',
                border: '1px solid var(--portal-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '5px 8px',
                fontSize: '0.75rem',
                color: 'var(--portal-text-muted)',
              }}
            >
              e.g. Sarah Jenkins
            </div>
          </div>
          <div>
            <label
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'var(--portal-text-secondary)',
                display: 'block',
                marginBottom: '3px',
              }}
            >
              Work Email
            </label>
            <div
              style={{
                background: 'var(--portal-surface)',
                border: '1px solid var(--portal-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '5px 8px',
                fontSize: '0.75rem',
                color: 'var(--portal-text-muted)',
              }}
            >
              sarah.j@company.org
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button
            type="button"
            style={{
              background: 'var(--portal-accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '5px 12px',
              fontSize: '0.725rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <Send size={11} /> Submit Registration
          </button>
        </div>
      </div>
    );
  }

  // 17. Modal & AlertDialog
  if (field.type === 'Modal' || field.type === 'AlertDialog') {
    return (
      <div
        style={{
          background: 'var(--portal-surface-elevated)',
          border: '1px solid var(--portal-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderBottom: '1px solid var(--portal-border)',
            background: 'var(--portal-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Maximize2 size={13} style={{ color: 'var(--portal-accent)' }} />
            <span
              style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--portal-text-primary)' }}
            >
              {field.props.title || 'Confirm Profile Changes'}
            </span>
          </div>
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--portal-text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={12} />
          </div>
        </div>
        <div
          style={{
            padding: '12px 14px',
            fontSize: '0.75rem',
            color: 'var(--portal-text-secondary)',
            lineHeight: '1.4',
          }}
        >
          {field.props.message ||
            field.props.description ||
            'Review and confirm the updated employee identity and system access permissions. This will trigger downstream synchronization across Keycloak and PostgreSQL.'}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '8px',
            padding: '8px 14px',
            background: 'var(--portal-surface)',
            borderTop: '1px solid var(--portal-border)',
          }}
        >
          <button
            type="button"
            style={{
              background: 'transparent',
              border: '1px solid var(--portal-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 10px',
              fontSize: '0.725rem',
              color: 'var(--portal-text-secondary)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            style={{
              background:
                field.type === 'AlertDialog' ? 'var(--portal-error)' : 'var(--portal-accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 12px',
              fontSize: '0.725rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {field.type === 'AlertDialog' ? 'Confirm Action' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  }

  // 18. Card & Surface
  if (field.type === 'Card' || field.type === 'Surface') {
    return (
      <div
        style={{
          background: 'var(--portal-surface-elevated)',
          border: '1px solid var(--portal-border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--portal-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box size={14} style={{ color: 'var(--portal-accent)' }} />
            <div>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--portal-text-primary)',
                }}
              >
                {field.props.title || 'Department Card'}
              </div>
              <div style={{ fontSize: '0.675rem', color: 'var(--portal-text-muted)' }}>
                {field.props.subtitle || 'Active Team Records'}
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: '0.65rem',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--portal-success)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 600,
            }}
          >
            Active
          </span>
        </div>
        <div
          style={{
            padding: '12px 14px',
            fontSize: '0.75rem',
            color: 'var(--portal-text-secondary)',
            lineHeight: '1.4',
          }}
        >
          {field.props.content ||
            'Structured HeroUI Card container with integrated Header, Body, and Footer sub-slots.'}
        </div>
        <div
          style={{
            padding: '8px 14px',
            background: 'var(--portal-surface)',
            borderTop: '1px solid var(--portal-border)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <span
            style={{
              fontSize: '0.725rem',
              color: 'var(--portal-accent)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            View Details <ChevronRight size={12} />
          </span>
        </div>
      </div>
    );
  }

  // 19. Drawer Slide-Over
  if (field.type === 'Drawer') {
    return (
      <div
        style={{
          background: 'var(--portal-surface-elevated)',
          border: '1px solid var(--portal-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          padding: '12px 14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SlidersHorizontal size={13} style={{ color: 'var(--portal-accent)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              {field.props.title || 'Configuration Drawer'}
            </span>
          </div>
          <X size={12} style={{ color: 'var(--portal-text-muted)', cursor: 'pointer' }} />
        </div>
        <div
          style={{
            fontSize: '0.725rem',
            color: 'var(--portal-text-secondary)',
            marginBottom: '10px',
          }}
        >
          Slide-out inspector drawer panel for auxiliary controls and parameters.
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
          <button
            type="button"
            style={{
              background: 'var(--portal-accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 10px',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          >
            Apply Settings
          </button>
        </div>
      </div>
    );
  }

  // 20. Popover & Tooltip
  if (field.type === 'Popover' || field.type === 'Tooltip') {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px' }}>
        <div
          style={{
            background: 'var(--portal-surface-elevated)',
            border: '1px solid var(--portal-accent)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: '0.725rem',
              fontWeight: 600,
              color: 'var(--portal-accent)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Sparkles size={11} /> {field.props.title || field.type}
          </div>
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--portal-text-secondary)',
              marginTop: '2px',
            }}
          >
            {field.props.content || 'Contextual overlay anchored to trigger target'}
          </div>
        </div>
      </div>
    );
  }

  // 21. Accordion, Disclosure & DisclosureGroup (HeroUI v3 specification)
  if (
    field.type === 'Accordion' ||
    field.type === 'Disclosure' ||
    field.type === 'DisclosureGroup'
  ) {
    const isAccordion = field.type === 'Accordion';
    const isDisclosureGroup = field.type === 'DisclosureGroup';
    const isSingleDisclosure = field.type === 'Disclosure';
    const isSurface = (field.props.variant || 'surface') === 'surface';
    const allowsMultiple = isDisclosureGroup || !!field.props.allowsMultipleExpanded;
    const hideSeparator = !!field.props.hideSeparator;
    const isDisabled = !!field.props.isDisabled;
    const align = field.props.align || 'stretch';
    const maxWidth = field.props.maxWidth || (align === 'center' ? '640px' : '100%');
    const titleAlign = field.props.titleAlign || 'start';
    const isApiSource = field.props.dataSource === 'api';

    // Resolve items: check dynamic API cache first, then field.props.items, then enterprise fallback
    const apiData = liveFormValues[field.id + '_api_data'];
    const rawItems =
      isApiSource && Array.isArray(apiData) && apiData.length > 0 ? apiData : field.props.items;

    const fieldMappings = field.props.fieldMappings || {};
    const titlePath = (fieldMappings.title || '@.title').replace(/^@\./, '');
    const contentPath = (fieldMappings.content || '@.content').replace(/^@\./, '');
    const idPath = (fieldMappings.id || '@.id').replace(/^@\./, '');
    const iconPath = (fieldMappings.icon || '@.icon').replace(/^@\./, '');

    const resolveFieldVal = (obj: any, path: string) => {
      if (!obj || !path) return undefined;
      const parts = path.split('.');
      let val = obj;
      for (const p of parts) {
        if (val && typeof val === 'object' && val[p] !== undefined) {
          val = val[p];
        } else {
          return undefined;
        }
      }
      return val;
    };

    const accordionItems: Array<{ id: string; title: string; content: string; icon?: string }> =
      Array.isArray(rawItems) && rawItems.length > 0
        ? rawItems.map((it: any, idx: number) => {
            if (typeof it === 'string') {
              return {
                id: `item-${idx + 1}`,
                title: it,
                content: `Detailed operational parameters for ${it}.`,
                icon: 'FileText',
              };
            }
            const resolvedTitle =
              resolveFieldVal(it, titlePath) ??
              it.title ??
              it.heading ??
              it.question ??
              it.name ??
              `Item ${idx + 1}`;
            const resolvedContent =
              resolveFieldVal(it, contentPath) ??
              it.content ??
              it.description ??
              it.answer ??
              it.body ??
              '';
            const resolvedId =
              resolveFieldVal(it, idPath) ?? it.id ?? it.key ?? it.code ?? `item-${idx + 1}`;
            const resolvedIcon = resolveFieldVal(it, iconPath) ?? it.icon ?? it.iconName;

            return {
              id: String(resolvedId),
              title: String(resolvedTitle),
              content: String(resolvedContent),
              icon: typeof resolvedIcon === 'string' ? resolvedIcon : undefined,
            };
          })
        : isSingleDisclosure
          ? [
              {
                id: 'item-1',
                title: field.props.title || 'Show Detailed Compliance Guidelines',
                content:
                  field.props.content ||
                  'Standard operating procedures for confidential HR records under ISO 27001.',
                icon: 'FileText',
              },
            ]
          : [
              {
                id: 'item-1',
                title: field.props.title || 'Security Clearance & Background Check',
                content:
                  field.props.content ||
                  'Dual-approval required for root access. Background verification logged in audit registry.',
                icon: 'ShieldCheck',
              },
              {
                id: 'item-2',
                title: 'Employment Terms & Compliance Agreement',
                content:
                  'Standard enterprise non-disclosure agreement, intellectual property assignment, and automated compliance provisions apply.',
                icon: 'FileText',
              },
              {
                id: 'item-3',
                title: 'Access Roles & Permissions Matrix',
                content:
                  'Granular RBAC privileges enforced by OpenPolicyAgent with least-privilege delegation and multi-factor approval requirements.',
                icon: 'Lock',
              },
            ];

    const expandedStateKey = field.id + '_expanded';
    const currentExpanded: string[] =
      liveFormValues[expandedStateKey] !== undefined
        ? (liveFormValues[expandedStateKey] as string[])
        : ['item-1']; // first item expanded initially

    const toggleAccordionItem = (itemId: string, e: React.MouseEvent) => {
      if (isDisabled) return;
      e.stopPropagation();
      const isExpanded = currentExpanded.includes(itemId);
      let nextExpanded: string[];
      if (allowsMultiple) {
        nextExpanded = isExpanded
          ? currentExpanded.filter((id) => id !== itemId)
          : [...currentExpanded, itemId];
      } else {
        nextExpanded = isExpanded ? [] : [itemId];
      }
      setLiveFormValues((prev) => ({
        ...prev,
        [expandedStateKey]: nextExpanded,
      }));
    };

    const renderAccordionIcon = (iconName?: string) => {
      if (iconName === 'ShieldCheck') {
        return <ShieldCheck size={16} style={{ color: 'var(--portal-accent)', flexShrink: 0 }} />;
      }
      if (iconName === 'FileText') {
        return <FileText size={16} style={{ color: 'var(--portal-text-muted)', flexShrink: 0 }} />;
      }
      if (iconName === 'Lock') {
        return <Lock size={16} style={{ color: 'var(--portal-text-muted)', flexShrink: 0 }} />;
      }
      return null;
    };

    const handleSyncApi = async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        const endpoint = field.props.apiEndpoint || '/api/accordion-items';
        const res = await fetch(endpoint);
        if (res.ok) {
          const json = await res.json();
          let data = json;
          if (field.props.dataPath) {
            const cleanPath = field.props.dataPath.replace(/^\$\./, '').split('.');
            for (const p of cleanPath) {
              if (p && data && data[p] !== undefined) {
                data = data[p];
              }
            }
          }
          if (Array.isArray(data)) {
            setLiveFormValues((prev) => ({
              ...prev,
              [field.id + '_api_data']: data,
            }));
          }
        }
      } catch (err) {
        console.error('API fetch error:', err);
      }
    };

    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent:
            align === 'center'
              ? 'center'
              : align === 'end'
                ? 'flex-end'
                : align === 'start'
                  ? 'flex-start'
                  : 'stretch',
        }}
      >
        <div
          className={`accordion ${isSurface ? 'accordion--surface' : ''}`}
          style={{
            width: align === 'stretch' ? '100%' : '100%',
            maxWidth: maxWidth !== '100%' ? maxWidth : align === 'center' ? '640px' : '100%',
            marginInline: align === 'center' ? 'auto' : undefined,
            background: isSurface ? 'var(--portal-surface)' : 'transparent',
            border: isSurface ? '1px solid var(--portal-border)' : 'none',
            borderRadius: isSurface ? 'min(24px, var(--radius-3xl))' : 0,
            overflow: 'hidden',
            boxShadow: isSurface ? '0 1px 3px rgba(0, 0, 0, 0.04)' : 'none',
            opacity: isDisabled ? 0.5 : 1,
            pointerEvents: isDisabled ? 'none' : 'auto',
          }}
        >
          {/* API Source Indicator Header (Builder Mode) */}
          {isApiSource && !isPreviewMode && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 14px',
                background: 'rgba(59, 130, 246, 0.08)',
                borderBottom: '1px solid var(--portal-border)',
                fontSize: '0.675rem',
                color: 'var(--portal-accent)',
                fontWeight: 600,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={11} />
                <span>API Source: {field.props.apiEndpoint || '/api/accordion-items'}</span>
              </div>
              <button
                type="button"
                onClick={handleSyncApi}
                style={{
                  background: 'var(--portal-accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '2px 8px',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Sync API
              </button>
            </div>
          )}

          {accordionItems.map((item, index) => {
            const isExpanded = currentExpanded.includes(item.id);
            const isFirst = index === 0;
            const isLast = index === accordionItems.length - 1;

            return (
              <div key={item.id} className="accordion__item" style={{ position: 'relative' }}>
                {/* Trigger Button */}
                <button
                  type="button"
                  className="accordion__trigger"
                  onClick={(e) => toggleAccordionItem(item.id, e)}
                  aria-expanded={isExpanded}
                  disabled={isDisabled}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '14px 16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    transition: 'background-color 150ms ease',
                    borderTopLeftRadius:
                      isSurface && isFirst && !isApiSource ? 'min(24px, var(--radius-3xl))' : 0,
                    borderTopRightRadius:
                      isSurface && isFirst && !isApiSource ? 'min(24px, var(--radius-3xl))' : 0,
                    borderBottomLeftRadius:
                      isSurface && isLast && !isExpanded ? 'min(24px, var(--radius-3xl))' : 0,
                    borderBottomRightRadius:
                      isSurface && isLast && !isExpanded ? 'min(24px, var(--radius-3xl))' : 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled) {
                      e.currentTarget.style.backgroundColor = 'var(--portal-surface-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent:
                        titleAlign === 'center'
                          ? 'center'
                          : titleAlign === 'end'
                            ? 'flex-end'
                            : 'flex-start',
                      gap: '10px',
                      flex: 1,
                      textAlign: titleAlign as any,
                    }}
                  >
                    {renderAccordionIcon(item.icon)}
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'var(--portal-text-primary)',
                        lineHeight: '1.4',
                      }}
                    >
                      {item.title}
                    </span>
                  </div>

                  <div
                    className="accordion__indicator"
                    data-expanded={isExpanded}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: isExpanded ? 'rotate(-180deg)' : 'rotate(0deg)',
                      transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                      flexShrink: 0,
                      marginLeft: '12px',
                    }}
                  >
                    <ChevronDown size={16} style={{ color: 'var(--portal-text-muted)' }} />
                  </div>
                </button>

                {/* Collapsible Panel Body */}
                {isExpanded && (
                  <div
                    className="accordion__panel"
                    style={{
                      padding: item.icon ? '0 16px 14px 42px' : '0 16px 14px 16px',
                      fontSize: '0.825rem',
                      lineHeight: '1.55',
                      color: 'var(--portal-text-secondary)',
                      textAlign: titleAlign === 'center' ? 'center' : 'start',
                    }}
                  >
                    <div className="accordion__body-inner">{item.content}</div>
                  </div>
                )}

                {/* Item Separator Line */}
                {!hideSeparator && !isLast && (
                  <div
                    style={{
                      margin: isSurface ? '0 3%' : 0,
                      width: isSurface ? '94%' : '100%',
                      height: '1px',
                      backgroundColor: 'var(--portal-border)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 22. Table
  if (field.type === 'Table') {
    return (
      <div
        style={{
          background: 'var(--portal-surface-elevated)',
          border: '1px solid var(--portal-border)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            padding: '6px 10px',
            background: 'var(--portal-surface)',
            borderBottom: '1px solid var(--portal-border)',
            fontSize: '0.675rem',
            fontWeight: 700,
            color: 'var(--portal-text-secondary)',
            textTransform: 'uppercase',
          }}
        >
          <span>Name &amp; Role</span>
          <span>Department</span>
          <span style={{ textAlign: 'right' }}>Status</span>
        </div>
        {[
          { name: 'Sarah Jenkins', role: 'Staff Eng', dept: 'Platform', status: 'Active' },
          { name: 'Ahmed Al-Harthy', role: 'Arch Spec', dept: 'Enterprise', status: 'Pending' },
        ].map((row) => (
          <div
            key={row.name}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              padding: '6px 10px',
              borderBottom: '1px solid var(--portal-border)',
              fontSize: '0.725rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: 'var(--portal-text-primary)' }}>{row.name}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--portal-text-muted)' }}>
                {row.role}
              </div>
            </div>
            <div style={{ color: 'var(--portal-text-secondary)' }}>{row.dept}</div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '0.625rem',
                  padding: '2px 5px',
                  borderRadius: '4px',
                  background:
                    row.status === 'Active'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(245, 158, 11, 0.15)',
                  color:
                    row.status === 'Active' ? 'var(--portal-success)' : 'var(--portal-warning)',
                  fontWeight: 600,
                }}
              >
                {row.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 23. ListBox, Menu, Dropdown
  if (field.type === 'ListBox' || field.type === 'Menu' || field.type === 'Dropdown') {
    return (
      <div
        style={{
          background: 'var(--portal-surface-elevated)',
          border: '1px solid var(--portal-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            fontSize: '0.675rem',
            fontWeight: 700,
            color: 'var(--portal-text-muted)',
            padding: '4px 8px',
            textTransform: 'uppercase',
          }}
        >
          {field.props.title || field.type} Actions
        </div>
        {['View Record Summary', 'Edit Access Credentials', 'Export Audit Trail'].map(
          (item, idx) => (
            <div
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.725rem',
                color: idx === 0 ? 'var(--portal-accent)' : 'var(--portal-text-primary)',
                background: idx === 0 ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <span>{item}</span>
              <ChevronRight size={11} style={{ color: 'var(--portal-text-muted)' }} />
            </div>
          ),
        )}
      </div>
    );
  }

  // 24. Tabs
  if (field.type === 'Tabs') {
    return (
      <div style={{ borderBottom: '1px solid var(--portal-border)', paddingBottom: '2px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['General Details', 'Permissions', 'Audit Logs'].map((tab, idx) => (
            <div
              key={tab}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                color: idx === 0 ? 'var(--portal-accent)' : 'var(--portal-text-muted)',
                borderBottom:
                  idx === 0 ? '2px solid var(--portal-accent)' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 25. Breadcrumbs
  if (field.type === 'Breadcrumbs') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.725rem' }}>
        <span style={{ color: 'var(--portal-text-muted)' }}>Portal</span>
        <ChevronRight size={11} style={{ color: 'var(--portal-text-muted)' }} />
        <span style={{ color: 'var(--portal-text-muted)' }}>Employees</span>
        <ChevronRight size={11} style={{ color: 'var(--portal-text-muted)' }} />
        <span style={{ color: 'var(--portal-accent)', fontWeight: 600 }}>Registration Form</span>
      </div>
    );
  }

  // 26. Pagination
  if (field.type === 'Pagination') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {['«', '1', '2', '3', '»'].map((pg, idx) => (
          <div
            key={pg}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--portal-border)',
              background: idx === 2 ? 'var(--portal-accent)' : 'var(--portal-surface-elevated)',
              color: idx === 2 ? '#fff' : 'var(--portal-text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {pg}
          </div>
        ))}
      </div>
    );
  }

  // 27. ScrollShadow
  if (field.type === 'ScrollShadow') {
    return (
      <div
        style={{
          border: '1px dashed var(--portal-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 10px',
          background: 'var(--portal-surface-elevated)',
          position: 'relative',
        }}
      >
        <div style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--portal-text-primary)' }}>
          ScrollShadow Container
        </div>
        <div style={{ fontSize: '0.675rem', color: 'var(--portal-text-muted)', marginTop: '2px' }}>
          Gradient edge masks automatically reveal scroll depth on overflow.
        </div>
      </div>
    );
  }

  // 28. Avatar & AvatarGroup
  if (field.type === 'Avatar' || field.type === 'AvatarGroup') {
    return (
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>
          {field.props.label || 'Reviewers / Profile'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {(field.props.names || ['Sarah Jenkins', 'Ahmed K.']).map(
            (name: string, avIdx: number) => (
              <div
                key={name}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: `hsl(${avIdx * 70 + 200}, 70%, 50%)`,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  border: '2px solid var(--portal-surface)',
                  marginInlineStart: avIdx > 0 ? '-8px' : 0,
                }}
              >
                {name.slice(0, 1)}
              </div>
            ),
          )}
        </div>
      </div>
    );
  }

  // 29. Chips, Badges, Tags, Kbd
  if (
    field.type === 'Badge' ||
    field.type === 'Chip' ||
    field.type === 'TagGroup' ||
    field.type === 'Kbd'
  ) {
    return (
      <div>
        <span
          style={{
            fontSize: '0.725rem',
            background: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--portal-success)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Sparkles size={11} /> {field.props.label || field.props.text || 'Badge Tag'}
        </span>
      </div>
    );
  }

  // 30. Progress, Meter, ProgressCircle, Spinner, Skeleton
  if (field.type === 'ProgressBar' || field.type === 'Meter') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
            {field.props.label || 'Progress'}
          </span>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            {field.props.value || 75}%
          </span>
        </div>
        <div
          style={{
            height: '8px',
            borderRadius: '9999px',
            background: 'var(--portal-border)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${field.props.value || 75}%`,
              height: '100%',
              background: 'var(--portal-accent)',
            }}
          />
        </div>
      </div>
    );
  }

  if (field.type === 'ProgressCircle') {
    const pct = field.props.value || 85;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative', width: '38px', height: '38px' }}>
          <svg width="38" height="38" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--portal-border)"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--portal-accent)"
              strokeWidth="3"
              strokeDasharray={`${pct}, 100`}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--portal-accent)',
            }}
          >
            {pct}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>
            {field.props.label || 'Task Progress'}
          </div>
          <div style={{ fontSize: '0.675rem', color: 'var(--portal-text-muted)' }}>
            Completion Ratio
          </div>
        </div>
      </div>
    );
  }

  if (field.type === 'Spinner') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
        <Loader2 size={16} className="animate-spin" style={{ color: 'var(--portal-accent)' }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--portal-text-secondary)' }}>
          {field.props.label || 'Loading asynchronous broker dataset...'}
        </span>
      </div>
    );
  }

  if (field.type === 'Skeleton') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        <div
          style={{
            height: '14px',
            width: '60%',
            background: 'var(--portal-border)',
            borderRadius: '4px',
            opacity: 0.6,
          }}
        />
        <div
          style={{
            height: '24px',
            width: '100%',
            background: 'var(--portal-border)',
            borderRadius: '4px',
            opacity: 0.4,
          }}
        />
      </div>
    );
  }

  // 31. Typography & Header & EmptyState
  if (field.type === 'Typography' || field.type === 'Header') {
    return (
      <div style={{ padding: '4px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h4
            style={{
              margin: 0,
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--portal-text-primary)',
            }}
          >
            {field.props.title || field.props.text || 'Section Header'}
          </h4>
          <span
            style={{
              fontSize: '0.625rem',
              background: 'rgba(59, 130, 246, 0.1)',
              color: 'var(--portal-accent)',
              padding: '1px 5px',
              borderRadius: '3px',
              fontWeight: 600,
            }}
          >
            HeroUI Typography
          </span>
        </div>
        {field.props.subtitle && (
          <div
            style={{ fontSize: '0.725rem', color: 'var(--portal-text-muted)', marginTop: '2px' }}
          >
            {field.props.subtitle}
          </div>
        )}
      </div>
    );
  }

  if (field.type === 'EmptyState') {
    return (
      <div
        style={{
          border: '1px dashed var(--portal-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          textAlign: 'center',
          background: 'var(--portal-surface-elevated)',
        }}
      >
        <Sparkles size={22} style={{ color: 'var(--portal-accent)', margin: '0 auto 6px' }} />
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--portal-text-primary)' }}>
          {field.props.title || 'No Pending Records'}
        </div>
        <div
          style={{
            fontSize: '0.7rem',
            color: 'var(--portal-text-muted)',
            margin: '3px 0 10px',
          }}
        >
          {field.props.description || 'All items have been approved or dispatched.'}
        </div>
        <button
          type="button"
          style={{
            background: 'var(--portal-accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 10px',
            fontSize: '0.7rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {field.props.buttonText || 'Refresh Dataset'}
        </button>
      </div>
    );
  }

  // 32. Separator, Toolbar, Link, ButtonGroup
  if (field.type === 'Separator') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--portal-border)' }} />
        {field.props.label && (
          <span
            style={{
              fontSize: '0.675rem',
              color: 'var(--portal-text-muted)',
              textTransform: 'uppercase',
            }}
          >
            {field.props.label}
          </span>
        )}
        <div style={{ flex: 1, height: '1px', background: 'var(--portal-border)' }} />
      </div>
    );
  }

  if (field.type === 'Toolbar') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 10px',
          background: 'var(--portal-surface-elevated)',
          border: '1px solid var(--portal-border)',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            style={{
              background: 'var(--portal-surface)',
              border: '1px solid var(--portal-border)',
              borderRadius: '4px',
              padding: '3px 8px',
              fontSize: '0.7rem',
              color: 'var(--portal-text-primary)',
            }}
          >
            Filter
          </button>
          <button
            type="button"
            style={{
              background: 'var(--portal-surface)',
              border: '1px solid var(--portal-border)',
              borderRadius: '4px',
              padding: '3px 8px',
              fontSize: '0.7rem',
              color: 'var(--portal-text-primary)',
            }}
          >
            Sort
          </button>
        </div>
        <span style={{ fontSize: '0.675rem', color: 'var(--portal-text-muted)' }}>
          HeroUI Action Toolbar
        </span>
      </div>
    );
  }

  if (field.type === 'Link') {
    return (
      <a
        href={field.props.href || '#'}
        onClick={(e) => e.preventDefault()}
        style={{
          fontSize: '0.75rem',
          color: 'var(--portal-accent)',
          textDecoration: 'underline',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: 600,
        }}
      >
        <LinkIcon size={12} /> {field.props.label || 'External Reference Document'}
      </a>
    );
  }

  if (field.type === 'ButtonGroup') {
    return (
      <div
        style={{
          display: 'inline-flex',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          border: '1px solid var(--portal-border)',
        }}
      >
        {['Save Draft', 'Publish Live'].map((btn, idx) => (
          <button
            key={btn}
            type="button"
            style={{
              background: idx === 1 ? 'var(--portal-accent)' : 'var(--portal-surface-elevated)',
              color: idx === 1 ? '#fff' : 'var(--portal-text-primary)',
              border: 'none',
              borderInlineStart: idx > 0 ? '1px solid var(--portal-border)' : 'none',
              padding: '6px 12px',
              fontSize: '0.725rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {btn}
          </button>
        ))}
      </div>
    );
  }

  if (field.type === 'Label' || field.type === 'Description' || field.type === 'FieldError') {
    if (field.type === 'FieldError') {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--portal-error)',
            fontSize: '0.7rem',
          }}
        >
          <AlertCircle size={12} />{' '}
          {field.props.message || 'Value does not satisfy schema validation constraint.'}
        </div>
      );
    }
    if (field.type === 'Description') {
      return (
        <div style={{ fontSize: '0.675rem', color: 'var(--portal-text-muted)' }}>
          {field.props.text || 'Helper annotation describing input requirements and format.'}
        </div>
      );
    }
    return (
      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--portal-text-primary)' }}>
        {field.props.text || field.props.label || 'Field Label'}
      </label>
    );
  }

  // 33. Polished Fallback for any other component (Never returns bare 'HeroUI Component Node')
  return (
    <div
      style={{
        background: 'var(--portal-surface-elevated)',
        border: '1px solid var(--portal-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 12px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}
      >
        <div style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--portal-text-primary)' }}>
          {field.props.title || field.props.label || field.type}
        </div>
        <span
          style={{
            fontSize: '0.625rem',
            background: 'rgba(59, 130, 246, 0.1)',
            color: 'var(--portal-accent)',
            padding: '1px 5px',
            borderRadius: '3px',
            fontWeight: 600,
          }}
        >
          {field.type}
        </span>
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--portal-text-secondary)', lineHeight: '1.4' }}>
        {field.props.content ||
          field.props.description ||
          `${field.type} HeroUI v3 Canonical Component`}
      </div>
    </div>
  );
}
