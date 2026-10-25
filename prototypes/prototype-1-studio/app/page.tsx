'use client';

import React, { useState, useEffect } from 'react';
import initialEmployees from '../fixtures/employees.json';
import initialPageData from '../fixtures/page-nodes.json';
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
  FileCode,
  Lock,
  Plus,
  Trash2,
  Copy,
  ChevronRight,
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
} from 'lucide-react';

type Viewport = 'desktop' | 'tablet' | 'mobile';
type ThemeMode = 'dark' | 'light';
type Direction = 'ltr' | 'rtl';
type InspectorTab = 'properties' | 'grid' | 'binding' | 'permissions';
type CanvasSectionKey = 'header' | 'form' | 'table';

interface HeroUIComponentItem {
  type: string;
  category: 'Form Controls' | 'Layout' | 'Interactive' | 'Data Display' | 'Feedback' | 'Navigation';
  icon: any;
  desc: string;
  badge?: 'New' | 'Updated';
  defaultProps: Record<string, any>;
  defaultBinding: {
    field: string;
    path: string;
    operation: string;
    validation?: string;
  };
  defaultLayout: {
    colSpan: number;
    colStart?: number;
  };
}

// Canonical HeroUI-Styled Component Catalog
const HERO_UI_CATALOG: HeroUIComponentItem[] = [
  // Form Controls
  {
    type: 'Input',
    category: 'Form Controls',
    icon: Type,
    desc: 'Single-line text input field with floating label',
    defaultProps: { label: 'Full Name', placeholder: 'e.g. Sarah Jenkins', required: true },
    defaultBinding: {
      field: 'fullName',
      path: '$.data.employee.fullName',
      operation: 'POST /api/employees',
      validation: 'required, min:2',
    },
    defaultLayout: { colSpan: 6 },
  },
  {
    type: 'Select',
    category: 'Form Controls',
    icon: Sliders,
    desc: 'Dropdown selection menu with accessible option list',
    defaultProps: {
      label: 'Department',
      options: ['Engineering', 'Finance', 'Human Resources', 'Operations'],
      required: true,
    },
    defaultBinding: {
      field: 'departmentId',
      path: '$.data.employee.departmentId',
      operation: 'POST /api/employees',
      validation: 'required',
    },
    defaultLayout: { colSpan: 6 },
  },
  {
    type: 'Autocomplete',
    category: 'Form Controls',
    badge: 'Updated',
    icon: Search,
    desc: 'Searchable auto-suggest input with dynamic filtering',
    defaultProps: {
      label: 'Primary Office Location',
      placeholder: 'Search city or branch...',
      options: ['Dubai Hub (HQ)', 'Abu Dhabi Tech Park', 'Riyadh Center', 'Muscat Branch'],
      required: false,
    },
    defaultBinding: {
      field: 'officeLocation',
      path: '$.data.employee.officeLocation',
      operation: 'POST /api/employees',
    },
    defaultLayout: { colSpan: 6 },
  },
  {
    type: 'Calendar',
    category: 'Form Controls',
    badge: 'Updated',
    icon: CalendarIcon,
    desc: 'Date picker and appointment range selector',
    defaultProps: { label: 'Employment Start Date', placeholder: 'YYYY-MM-DD' },
    defaultBinding: {
      field: 'startDate',
      path: '$.data.employee.startDate',
      operation: 'POST /api/employees',
      validation: 'iso8601-date',
    },
    defaultLayout: { colSpan: 6 },
  },
  {
    type: 'Checkbox',
    category: 'Form Controls',
    badge: 'Updated',
    icon: CheckSquare,
    desc: 'Boolean agreement checkbox toggle',
    defaultProps: { label: 'Grant corporate VPN and production cluster access', checked: true },
    defaultBinding: {
      field: 'hasVpnAccess',
      path: '$.data.employee.security.vpn',
      operation: 'POST /api/employees',
    },
    defaultLayout: { colSpan: 12 },
  },
  {
    type: 'CheckboxGroup',
    category: 'Form Controls',
    badge: 'Updated',
    icon: CheckCircle2,
    desc: 'Group of related multi-selection check inputs',
    defaultProps: {
      label: 'Employee Benefit Enrolments',
      options: ['Medical Insurance', 'Remote Equipment Stipend', 'Transit Pass'],
    },
    defaultBinding: {
      field: 'enrolledBenefits',
      path: '$.data.employee.benefits',
      operation: 'POST /api/employees',
    },
    defaultLayout: { colSpan: 12 },
  },

  // Interactive
  {
    type: 'Button',
    category: 'Interactive',
    icon: MousePointer,
    desc: 'Action trigger or form submit mutation',
    defaultProps: { label: 'Save & Dispatch Record', variant: 'primary', isSubmit: true },
    defaultBinding: {
      field: 'submitTrigger',
      path: '$.action.submit',
      operation: 'POST /api/employees',
    },
    defaultLayout: { colSpan: 12 },
  },
  {
    type: 'Link',
    category: 'Interactive',
    icon: LinkIcon,
    desc: 'Internal or external hyperlink anchor',
    defaultProps: { text: 'View Compliance Policy', href: '/compliance/policy-2026' },
    defaultBinding: { field: 'href', path: '$.links.compliance', operation: 'GET /api/policy' },
    defaultLayout: { colSpan: 6 },
  },

  // Layout
  {
    type: 'Card',
    category: 'Layout',
    icon: Box,
    desc: 'Elevated surface container wrapper',
    defaultProps: { title: 'Card Container', bordered: true },
    defaultBinding: { field: '', path: '', operation: '' },
    defaultLayout: { colSpan: 12 },
  },
  {
    type: 'Accordion',
    category: 'Layout',
    icon: ChevronDown,
    desc: 'Vertically stacked collapsible disclosure item',
    defaultProps: {
      title: 'Security Clearance & Background Check',
      content:
        'Dual-approval required for root access. Background verification logged in audit registry.',
    },
    defaultBinding: { field: '', path: '', operation: '' },
    defaultLayout: { colSpan: 12 },
  },
  {
    type: 'Divider',
    category: 'Layout',
    icon: Minus,
    desc: 'Visual separator dividing form segments',
    defaultProps: { spacing: 'medium' },
    defaultBinding: { field: '', path: '', operation: '' },
    defaultLayout: { colSpan: 12 },
  },

  // Feedback
  {
    type: 'Alert',
    category: 'Feedback',
    icon: AlertCircle,
    desc: 'Contextual notification and audit warning banner',
    defaultProps: {
      title: 'Dual-Approval Policy Enforced',
      message:
        'Records created in this form will trigger a Keycloak workflow review before publication.',
      variant: 'warning',
    },
    defaultBinding: { field: '', path: '', operation: '' },
    defaultLayout: { colSpan: 12 },
  },

  // Data Display
  {
    type: 'AvatarGroup',
    category: 'Data Display',
    badge: 'New',
    icon: Users,
    desc: 'Stacked user avatar collection with presence ring',
    defaultProps: { count: 4, names: ['Ahmed K.', 'Sara M.', 'Tariq N.', 'Laila B.'] },
    defaultBinding: {
      field: 'reviewers',
      path: '$.data.assignedReviewers',
      operation: 'GET /api/users',
    },
    defaultLayout: { colSpan: 6 },
  },
  {
    type: 'Badge',
    category: 'Data Display',
    icon: Sparkles,
    desc: 'Status pill badge with variant coloring',
    defaultProps: { label: 'Active Status', variant: 'success' },
    defaultBinding: {
      field: 'statusBadge',
      path: '$.data.status',
      operation: 'GET /api/employees',
    },
    defaultLayout: { colSpan: 6 },
  },
  {
    type: 'Table',
    category: 'Data Display',
    icon: TableIcon,
    desc: 'Data-bound repeating enterprise table',
    defaultProps: { emptyText: 'No records found' },
    defaultBinding: { field: 'items', path: '$.data', operation: 'GET /api/employees' },
    defaultLayout: { colSpan: 12 },
  },

  // Navigation
  {
    type: 'Breadcrumbs',
    category: 'Navigation',
    icon: ChevronRight,
    desc: 'Hierarchical navigation path breadcrumbs',
    defaultProps: { items: ['Enterprise HR', 'Managers Directory', 'Onboard Member'] },
    defaultBinding: { field: '', path: '', operation: '' },
    defaultLayout: { colSpan: 12 },
  },
];

// Initial Form Children Fields
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
    type: 'Calendar',
    schemaVersion: 1,
    layout: { colStart: 1, colSpan: 6 },
    props: {
      label: 'Employment Start Date',
      placeholder: 'Select effective date...',
    },
    binding: {
      field: 'startDate',
      path: '$.data.employee.startDate',
      operation: 'POST /api/employees',
      validation: 'iso8601-date',
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
  // Studio Mode State: Design Mode vs Live Preview Mode
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Studio Viewport & Theme States
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'Saved' | 'Unsaved changes'>('Saved');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-field-fullname');
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('properties');

  // Canvas Section Ordering State (Header, Form, Table)
  const [sectionOrder, setSectionOrder] = useState<CanvasSectionKey[]>(['header', 'form', 'table']);

  // Moving & Drag-Reordering State for Form Fields
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
  const [dragOverFieldId, setDragOverFieldId] = useState<string | null>(null);
  const [dropIndicatorSide, setDropIndicatorSide] = useState<'before' | 'after'>('after');

  // HeroUI Drawer & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [draggedComponentType, setDraggedComponentType] = useState<string | null>(null);
  const [isDropOverForm, setIsDropOverForm] = useState<boolean>(false);

  // Live Interactive Preview State for Form Controls
  const [liveFormValues, setLiveFormValues] = useState<Record<string, any>>({
    'node-field-fullname': 'Sarah Jenkins',
    'node-field-dept': 'Engineering',
    'node-field-hiredate': '2026-11-01',
    'node-field-security': true,
  });
  const [submittedPreviewData, setSubmittedPreviewData] = useState<any | null>(null);

  // 3-Tier Persona: Administrator Governance State
  const [showAdminGovernanceModal, setShowAdminGovernanceModal] = useState<boolean>(false);
  const [adminAllowedComponents, setAdminAllowedComponents] = useState<Record<string, boolean>>({
    Input: true,
    Select: true,
    Autocomplete: true,
    Calendar: true,
    Checkbox: true,
    CheckboxGroup: true,
    Button: true,
    Link: true,
    Card: true,
    Accordion: true,
    Divider: true,
    Alert: true,
    AvatarGroup: true,
    Badge: true,
    Table: true,
    Breadcrumbs: true,
  });

  // Page Nodes State
  const [formFields, setFormFields] = useState<any[]>(INITIAL_FORM_FIELDS);
  const [pageNodes, setPageNodes] = useState(initialPageData.nodes);
  const [employees, setEmployees] = useState(initialEmployees.data);

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

  // Global Keyboard Shortcuts (Esc to exit preview or close modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAdminGovernanceModal) {
          setShowAdminGovernanceModal(false);
        } else if (isPreviewMode) {
          setIsPreviewMode(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode, showAdminGovernanceModal]);

  // Sitemap Pages
  const sitemapPages = [
    { id: 'p1', title: 'Home', route: '/', status: 'published' },
    { id: 'p2', title: 'Managers Directory', route: '/managers', status: 'draft', active: true },
    { id: 'p3', title: 'Employee Directory', route: '/employees', status: 'published' },
    {
      id: 'p4',
      title: 'Payroll & Compensation',
      route: '/payroll',
      status: 'draft',
      protected: true,
    },
    { id: 'p5', title: 'Admin Settings', route: '/admin', status: 'published', protected: true },
  ];

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

  const selectedNode = findNode(pageNodes, selectedNodeId);

  // Update Node Property
  const updateNodeProperty = (key: string, value: any) => {
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

  // Move Form Field in Array
  const moveFormField = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= formFields.length) return;
    setUndoStack((prev) => [
      ...prev,
      {
        pageNodes: JSON.parse(JSON.stringify(pageNodes)),
        formFields: [...formFields],
        sectionOrder: [...sectionOrder],
      },
    ]);
    setRedoStack([]);
    const updated = [...formFields];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setFormFields(updated);
    setSaveStatus('Unsaved changes');
  };

  // Reorder Form Fields via Drag and Drop
  const handleReorderFormField = (sourceId: string, targetId: string, side: 'before' | 'after') => {
    if (sourceId === targetId) return;
    const sourceIndex = formFields.findIndex((f) => f.id === sourceId);
    let targetIndex = formFields.findIndex((f) => f.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    if (side === 'after' && sourceIndex < targetIndex) {
      // insertion after target
    } else if (side === 'before' && sourceIndex > targetIndex) {
      // insertion before target
    }

    setUndoStack((prev) => [
      ...prev,
      {
        pageNodes: JSON.parse(JSON.stringify(pageNodes)),
        formFields: [...formFields],
        sectionOrder: [...sectionOrder],
      },
    ]);
    setRedoStack([]);

    const updated = [...formFields];
    const [moved] = updated.splice(sourceIndex, 1);
    const newTargetIndex = updated.findIndex((f) => f.id === targetId);
    const insertIndex = side === 'before' ? newTargetIndex : newTargetIndex + 1;
    updated.splice(insertIndex, 0, moved);

    setFormFields(updated);
    setSaveStatus('Unsaved changes');
  };

  // Move Section Up or Down on Canvas
  const moveCanvasSection = (sectionKey: CanvasSectionKey, direction: 'up' | 'down') => {
    const currentIndex = sectionOrder.indexOf(sectionKey);
    if (direction === 'up' && currentIndex > 0) {
      setUndoStack((prev) => [
        ...prev,
        {
          pageNodes: JSON.parse(JSON.stringify(pageNodes)),
          formFields: [...formFields],
          sectionOrder: [...sectionOrder],
        },
      ]);
      setRedoStack([]);
      const next = [...sectionOrder];
      [next[currentIndex - 1], next[currentIndex]] = [next[currentIndex], next[currentIndex - 1]];
      setSectionOrder(next);
      setSaveStatus('Unsaved changes');
    } else if (direction === 'down' && currentIndex < sectionOrder.length - 1) {
      setUndoStack((prev) => [
        ...prev,
        {
          pageNodes: JSON.parse(JSON.stringify(pageNodes)),
          formFields: [...formFields],
          sectionOrder: [...sectionOrder],
        },
      ]);
      setRedoStack([]);
      const next = [...sectionOrder];
      [next[currentIndex + 1], next[currentIndex]] = [next[currentIndex], next[currentIndex + 1]];
      setSectionOrder(next);
      setSaveStatus('Unsaved changes');
    }
  };

  // Drop Component into Form (Builder Tier)
  const handleDropComponentIntoForm = (componentType: string) => {
    if (!adminAllowedComponents[componentType]) {
      alert(
        `[Admin Governance Restriction]: "${componentType}" is currently disabled by the Administrator. Enable it in Admin Governance to place it on the canvas.`,
      );
      return;
    }

    const catalogItem = HERO_UI_CATALOG.find((c) => c.type === componentType);
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

    setUndoStack((prev) => [
      ...prev,
      {
        pageNodes: JSON.parse(JSON.stringify(pageNodes)),
        formFields: [...formFields],
        sectionOrder: [...sectionOrder],
      },
    ]);
    setRedoStack([]);
    setFormFields((prev) => [...prev, newFieldNode]);
    setSelectedNodeId(newId);
    setSaveStatus('Unsaved changes');
  };

  // Delete Form Component
  const handleDeleteFormField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUndoStack((prev) => [
      ...prev,
      {
        pageNodes: JSON.parse(JSON.stringify(pageNodes)),
        formFields: [...formFields],
        sectionOrder: [...sectionOrder],
      },
    ]);
    setRedoStack([]);
    setFormFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedNodeId === id) {
      setSelectedNodeId('node-manager-form');
    }
    setSaveStatus('Unsaved changes');
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

  // Filter HeroUI catalog
  const filteredCatalog = HERO_UI_CATALOG.filter((item) => {
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
  const totalCount = HERO_UI_CATALOG.length;

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
                {isPreviewMode ? 'Interactive Preview Mode' : 'Phase 3 Studio (Design Mode)'}
              </span>
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--portal-text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Project: Falaj Enterprise HR</span>
              <span>•</span>
              <span
                style={{
                  color: saveStatus === 'Saved' ? 'var(--portal-success)' : 'var(--portal-warning)',
                }}
              >
                {saveStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Viewport Controls, Undo/Redo & Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Undo / Redo (Shown in Design Mode) */}
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

          {/* Viewport Selectors (Active in both Design and Preview modes) */}
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
              onClick={() => setViewport('desktop')}
              style={{
                background: viewport === 'desktop' ? 'var(--portal-accent)' : 'transparent',
                color: viewport === 'desktop' ? '#fff' : 'var(--portal-text-secondary)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Laptop size={14} /> Desktop (12 Col)
            </button>
            <button
              onClick={() => setViewport('tablet')}
              style={{
                background: viewport === 'tablet' ? 'var(--portal-accent)' : 'transparent',
                color: viewport === 'tablet' ? '#fff' : 'var(--portal-text-secondary)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Tablet size={14} /> Tablet (768px)
            </button>
            <button
              onClick={() => setViewport('mobile')}
              style={{
                background: viewport === 'mobile' ? 'var(--portal-accent)' : 'transparent',
                color: viewport === 'mobile' ? '#fff' : 'var(--portal-text-secondary)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Smartphone size={14} /> Mobile (390px)
            </button>
          </div>

          {/* Grid Guides Toggle (Design Mode Only) */}
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

          {/* 3-Tier Administrator Governance Trigger Button (Design Mode Only) */}
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

        {/* Right Actions: Preview Mode Toggle, RTL, Theme, Publish */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* PREVIEW MODE TOGGLE BUTTON */}
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
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isPreviewMode
                ? '0 2px 10px rgba(59, 130, 246, 0.4)'
                : '0 2px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.15s ease',
            }}
          >
            {isPreviewMode ? <EyeOff size={15} /> : <Eye size={15} />}
            <span>{isPreviewMode ? 'Exit Preview' : 'Preview Page'}</span>
          </button>

          {/* RTL / LTR Toggle */}
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
            <Globe size={14} /> {direction === 'ltr' ? 'LTR (English)' : 'RTL (العربية)'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            title="Toggle Light / Dark Mode"
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

          {/* Publish Button (Design Mode Only) */}
          {!isPreviewMode && (
            <button
              onClick={() => {
                setSaveStatus('Saved');
                alert(
                  'Page published successfully to https://hr-portal.sites.example.com/managers (Release Manifest #104 generated with HeroUI Form & Table nodes)',
                );
              }}
              style={{
                background: 'var(--portal-accent)',
                color: 'var(--portal-accent-foreground)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              }}
            >
              <Send size={14} /> Publish
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
              All studio guides, outlines, and editor chrome are hidden. Form controls and links are
              fully interactive.
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

      {/* Main Studio Body: 3-Pane Layout (Sidebars hidden in Preview Mode) */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel: HeroUI Component Drawer (Hidden in Preview Mode) */}
        {!isPreviewMode && (
          <aside
            style={{
              width: '290px',
              background: 'var(--portal-surface)',
              borderInlineEnd: '1px solid var(--portal-border)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'hidden',
            }}
          >
            {/* HeroUI Drawer Header & Search */}
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
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
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
                  HeroUI Palette
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
                  placeholder="Search components..."
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
              {['Form Controls', 'Layout', 'Data Display', 'Interactive', 'Feedback'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
                  style={{
                    background:
                      selectedCategory === cat ? 'var(--portal-accent)' : 'var(--portal-surface)',
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
                              e.currentTarget.style.background = 'var(--portal-surface-elevated)';
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
                            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
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
            {/* 12-Column Guide Overlay (Suppressed in Preview Mode) */}
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

            {/* Canvas Sections Container rendered according to sectionOrder */}
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
                      {/* Section Move Controls (Design Mode Only) */}
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
                        Personnel & Management Directory
                      </h1>
                      <p
                        style={{
                          fontSize: '0.9rem',
                          color: 'var(--portal-text-secondary)',
                          maxWidth: '720px',
                        }}
                      >
                        Demonstrates live drag-and-drop element repositioning, section reordering,
                        and realistic interactive preview mode with live form submissions.
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
                        overflow: 'hidden',
                        cursor: isPreviewMode ? 'default' : 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Form Component Header & Badges */}
                      <div
                        style={{
                          padding: '0.65rem 1rem',
                          background: 'var(--portal-surface)',
                          borderBottom: '1px solid var(--portal-border)',
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

                              {/* Section Reorder Buttons */}
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

                      {/* Form Fields Canvas (Sub-grid 12 Columns with Drag Reordering) */}
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
                                  transition: 'all 0.15s ease',
                                  boxShadow: isDropTarget
                                    ? '0 0 12px rgba(59, 130, 246, 0.3)'
                                    : 'none',
                                }}
                              >
                                {/* Field Header Toolbar with Move Controls (Design Mode Only) */}
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

                                    {/* Move earlier/later arrow controls & delete */}
                                    <div
                                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                      {/* Move Left / Earlier */}
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

                                      {/* Move Right / Later */}
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

                                {/* Field Visual Rendering according to HeroUI styling */}
                                {field.type === 'Input' && (
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
                                      {field.props.required && (
                                        <span style={{ color: 'var(--portal-error)' }}> *</span>
                                      )}
                                    </label>
                                    <input
                                      type="text"
                                      placeholder={field.props.placeholder}
                                      value={
                                        liveFormValues[field.id] !== undefined
                                          ? liveFormValues[field.id]
                                          : field.props.placeholder || ''
                                      }
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
                                )}

                                {field.type === 'Select' && (
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
                                        value={
                                          liveFormValues[field.id] || field.props.options?.[0] || ''
                                        }
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
                                        <span>
                                          {field.props.options?.[0] || 'Choose an option...'}
                                        </span>
                                        <ChevronDown
                                          size={14}
                                          style={{ color: 'var(--portal-text-muted)' }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}

                                {field.type === 'Autocomplete' && (
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
                                      {field.props.label || 'Autocomplete'}
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
                                        placeholder={
                                          field.props.placeholder || 'Type to search options...'
                                        }
                                        value={liveFormValues[field.id] || ''}
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
                                )}

                                {field.type === 'Calendar' && (
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
                                      {field.props.label || 'Calendar Date'}
                                    </label>
                                    {isPreviewMode ? (
                                      <input
                                        type="date"
                                        value={liveFormValues[field.id] || '2026-11-01'}
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
                                      />
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
                                          color: 'var(--portal-text-secondary)',
                                        }}
                                      >
                                        <span>2026-11-01</span>
                                        <CalendarIcon
                                          size={14}
                                          style={{ color: 'var(--portal-accent)' }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}

                                {field.type === 'Checkbox' && (
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
                                          [field.id]: !prev[field.id],
                                        }));
                                      }
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '4px',
                                        background: liveFormValues[field.id]
                                          ? 'var(--portal-accent)'
                                          : 'transparent',
                                        border: `1px solid ${liveFormValues[field.id] ? 'var(--portal-accent)' : 'var(--portal-border)'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                      }}
                                    >
                                      {liveFormValues[field.id] && <Check size={11} />}
                                    </div>
                                    <span
                                      style={{
                                        fontSize: '0.775rem',
                                        color: 'var(--portal-text-primary)',
                                      }}
                                    >
                                      {field.props.label || 'Checkbox Agreement'}
                                    </span>
                                  </div>
                                )}

                                {field.type === 'CheckboxGroup' && (
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
                                      {field.props.label || 'Checkbox Options Group'}
                                    </label>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                      {(field.props.options || ['Option A', 'Option B']).map(
                                        (opt: string) => (
                                          <div
                                            key={opt}
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '6px',
                                            }}
                                          >
                                            <div
                                              style={{
                                                width: '14px',
                                                height: '14px',
                                                borderRadius: '3px',
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
                                            <span
                                              style={{
                                                fontSize: '0.725rem',
                                                color: 'var(--portal-text-secondary)',
                                              }}
                                            >
                                              {opt}
                                            </span>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                                {field.type === 'Button' && (
                                  <button
                                    type={isPreviewMode ? 'submit' : 'button'}
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
                                    <MousePointer size={14} />{' '}
                                    {field.props.label || 'Submit Action'}
                                  </button>
                                )}

                                {field.type === 'Alert' && (
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
                                    <AlertCircle
                                      size={15}
                                      style={{ color: 'var(--portal-warning)', flexShrink: 0 }}
                                    />
                                    <div>
                                      <div
                                        style={{
                                          fontSize: '0.75rem',
                                          fontWeight: 700,
                                          color: 'var(--portal-warning)',
                                        }}
                                      >
                                        {field.props.title || 'Form Alert'}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: '0.7rem',
                                          color: 'var(--portal-text-secondary)',
                                        }}
                                      >
                                        {field.props.message}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {field.type === 'AvatarGroup' && (
                                  <div>
                                    <div
                                      style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        marginBottom: '4px',
                                      }}
                                    >
                                      Assigned Reviewers
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      {(field.props.names || ['U1', 'U2', 'U3']).map(
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
                                )}

                                {field.type === 'Divider' && (
                                  <div
                                    style={{
                                      height: '1px',
                                      background: 'var(--portal-border)',
                                      margin: '4px 0',
                                    }}
                                  />
                                )}

                                {field.type === 'Accordion' && (
                                  <div
                                    style={{
                                      background: 'var(--portal-surface-elevated)',
                                      border: '1px solid var(--portal-border)',
                                      borderRadius: 'var(--radius-sm)',
                                      padding: '8px 10px',
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                      }}
                                    >
                                      <span>{field.props.title}</span>
                                      <ChevronDown size={14} />
                                    </div>
                                    <div
                                      style={{
                                        fontSize: '0.7rem',
                                        color: 'var(--portal-text-muted)',
                                        marginTop: '4px',
                                      }}
                                    >
                                      {field.props.content}
                                    </div>
                                  </div>
                                )}

                                {field.type === 'Card' && (
                                  <div
                                    style={{
                                      background: 'var(--portal-surface-elevated)',
                                      border: '1px solid var(--portal-border)',
                                      borderRadius: 'var(--radius-sm)',
                                      padding: '8px 10px',
                                    }}
                                  >
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                      {field.props.title}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: '0.7rem',
                                        color: 'var(--portal-text-muted)',
                                        marginTop: '2px',
                                      }}
                                    >
                                      Embedded nested card container
                                    </div>
                                  </div>
                                )}

                                {field.type === 'Badge' && (
                                  <div>
                                    <span
                                      style={{
                                        fontSize: '0.725rem',
                                        background: 'rgba(16, 185, 129, 0.15)',
                                        color: 'var(--portal-success)',
                                        padding: '3px 8px',
                                        borderRadius: 'var(--radius-sm)',
                                        fontWeight: 600,
                                      }}
                                    >
                                      {field.props.label}
                                    </span>
                                  </div>
                                )}

                                {field.type === 'Breadcrumbs' && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontSize: '0.725rem',
                                    }}
                                  >
                                    {(field.props.items || []).map(
                                      (item: string, bcIdx: number) => (
                                        <React.Fragment key={item}>
                                          {bcIdx > 0 && (
                                            <ChevronRight
                                              size={12}
                                              style={{ color: 'var(--portal-text-muted)' }}
                                            />
                                          )}
                                          <span
                                            style={{
                                              color:
                                                bcIdx === field.props.items.length - 1
                                                  ? 'var(--portal-accent)'
                                                  : 'var(--portal-text-muted)',
                                            }}
                                          >
                                            {item}
                                          </span>
                                        </React.Fragment>
                                      ),
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Visual Drop Zone Highlight (Hidden in Preview Mode) */}
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
                                  : 'Drop HeroUI Components Here'}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.725rem',
                                  color: 'var(--portal-text-muted)',
                                  maxWidth: '420px',
                                }}
                              >
                                Drag any allowed component from the HeroUI drawer or click its '+'
                                button to append. Reorder fields inside the form via drag-and-drop
                                or arrow buttons.
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
                      {/* Table Toolbar Badge */}
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

                              {/* Section Reorder Buttons */}
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

                      {/* Live Data-Bound Table Output */}
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
            </div>
          </div>
        </main>

        {/* Right Inspector Panel: Developer Data-Binding & Node Properties (Hidden in Preview Mode) */}
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
            {/* Inspector Header */}
            <div
              style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--portal-border)' }}
            >
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

                  {selectedNode?.props?.emptyText !== undefined && (
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
                        Empty State Message
                      </label>
                      <input
                        type="text"
                        value={selectedNode.props.emptyText}
                        onChange={(e) => updateNodeProperty('emptyText', e.target.value)}
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

                  {/* Column Span Slider */}
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

                  {/* Quick Preset Buttons */}
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

                  {/* Column Start Offset Stepper */}
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

              {/* TAB 3: DEVELOPER DATA BINDING (PHASE 5 ENGINE) */}
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
                      Map this visual control to upstream backend mutations and query paths.
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

      {/* 3-Tier Administrator Component Governance Modal */}
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
              width: '680px',
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
                    Tier 1 Governance: Configure which HeroUI components are allowed for builders in
                    this project.
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
                    HERO_UI_CATALOG.forEach((c) => (allAllowed[c.type] = true));
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
                    HERO_UI_CATALOG.forEach((c) => {
                      restrictedExperimental[c.type] =
                        c.badge !== 'New' && c.type !== 'Autocomplete';
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
              {HERO_UI_CATALOG.map((item) => {
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

      {/* Footer Status Bar (Hidden in Preview Mode for clean view) */}
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
            <span>Phase 3 Studio (Drag, Move & Preview)</span>
          </div>
        </footer>
      )}
    </div>
  );
}
