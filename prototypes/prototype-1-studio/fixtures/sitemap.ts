export interface SitemapNode {
  id: string;
  title: string;
  route: string;
  type: 'page' | 'folder';
  status: 'published' | 'draft' | 'archived';
  isHome?: boolean;
  requiredRole?: string;
  badge?: string;
  children?: SitemapNode[];
}

export interface StudioPageDefinition {
  pageId: string;
  title: string;
  route: string;
  description: string;
  requiredPermissions: string[];
  version: number;
  sectionOrder: ('header' | 'form' | 'table')[];
  pageNodes: any[];
  formFields: any[];
}

export const INITIAL_SITEMAP_TREE: SitemapNode[] = [
  {
    id: 'page-managers-01',
    title: 'Personnel & Directory',
    route: '/managers',
    type: 'page',
    status: 'published',
    isHome: true,
    requiredRole: 'managers.read',
  },
  {
    id: 'page-onboarding-02',
    title: 'Employee Onboarding',
    route: '/onboarding',
    type: 'page',
    status: 'draft',
    requiredRole: 'hr.write',
    badge: 'Updated',
  },
  {
    id: 'page-compliance-03',
    title: 'Security & Compliance',
    route: '/compliance',
    type: 'page',
    status: 'published',
    requiredRole: 'security.audit',
    badge: 'HeroUI v3',
  },
  {
    id: 'folder-admin',
    title: 'Administration',
    route: '/admin',
    type: 'folder',
    status: 'published',
    requiredRole: 'admin',
    children: [
      {
        id: 'page-roles-04',
        title: 'Roles & RBAC Matrix',
        route: '/admin/roles',
        type: 'page',
        status: 'draft',
        requiredRole: 'admin',
      },
      {
        id: 'page-audit-05',
        title: 'System Audit Logs',
        route: '/admin/audit',
        type: 'page',
        status: 'published',
        requiredRole: 'admin',
      },
    ],
  },
];

export const INITIAL_PAGES_REGISTRY: Record<string, StudioPageDefinition> = {
  'page-managers-01': {
    pageId: 'page-managers-01',
    title: 'Personnel & Management Directory',
    route: '/managers',
    description:
      'Live enterprise personnel synchronized via Upstream Core HR Broker. Demonstrates 12-column grid and RFC 9535 data binding.',
    requiredPermissions: ['managers.read'],
    version: 1,
    sectionOrder: ['header', 'form', 'table'],
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
                props: { level: 1, text: 'Personnel & Management Directory', align: 'start' },
              },
              {
                id: 'node-header-desc',
                type: 'Text',
                schemaVersion: 1,
                layout: { colStart: 1, colSpan: 8 },
                props: {
                  content:
                    'Live enterprise personnel synchronized via Upstream Core HR Broker. Demonstrates 12-column grid and RFC 9535 data binding.',
                  variant: 'muted',
                },
              },
            ],
          },
          {
            id: 'node-employee-table',
            type: 'Table',
            schemaVersion: 1,
            layout: { colStart: 1, colSpan: 12, minHeight: 320 },
            visibility: { requiredPermissions: ['employees.read'] },
            binding: {
              apiOperationId: 'op-emp-directory',
              collectionPath: '$.data',
              totalPath: '$.total',
              fieldMappings: {
                id: '@.id',
                name: '@.name',
                department: '@.department.name',
                jobTitle: '@.jobTitle',
                email: '@.email',
                active: '@.active',
              },
            },
            props: {
              columns: [
                { header: 'ID', mappingPath: '@.id', format: 'text', sortable: true },
                { header: 'Employee Name', mappingPath: '@.name', format: 'text', sortable: true },
                {
                  header: 'Department',
                  mappingPath: '@.department.name',
                  format: 'badge',
                  sortable: true,
                },
                {
                  header: 'Job Title',
                  mappingPath: '@.jobTitle',
                  format: 'text',
                  sortable: false,
                },
                { header: 'Email', mappingPath: '@.email', format: 'text', sortable: false },
                {
                  header: 'Status',
                  mappingPath: '@.active',
                  format: 'badge',
                  sortable: true,
                },
              ],
              emptyText: 'No personnel records found for this department.',
            },
          },
        ],
      },
    ],
    formFields: [
      {
        id: 'node-field-fullname',
        type: 'Input',
        schemaVersion: 1,
        layout: { colStart: 1, colSpan: 6 },
        props: { label: 'Full Name', placeholder: 'e.g. Sarah Jenkins', required: true },
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
          options: ['Engineering', 'Design', 'Product', 'Legal', 'Operations'],
          placeholder: 'Select department',
        },
        binding: {
          field: 'department',
          path: '$.data.employee.department',
          operation: 'POST /api/employees',
        },
      },
      {
        id: 'node-field-contract',
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
        props: { label: 'Grant corporate VPN and production cluster access', checked: true },
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
        props: { label: 'Save & Dispatch Record', variant: 'primary', isSubmit: true },
        binding: {
          field: 'submitAction',
          path: '$.action.submit',
          operation: 'POST /api/employees',
        },
      },
    ],
  },

  'page-onboarding-02': {
    pageId: 'page-onboarding-02',
    title: 'Employee Onboarding & Registration',
    route: '/onboarding',
    description:
      'Standardized corporate intake workflow with identity verification, hardware provisioning, and automated NDA signing.',
    requiredPermissions: ['hr.write'],
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
                props: {
                  level: 1,
                  text: 'Employee Onboarding & Registration',
                  align: 'start',
                },
              },
              {
                id: 'node-header-desc',
                type: 'Text',
                schemaVersion: 1,
                layout: { colStart: 1, colSpan: 8 },
                props: {
                  content:
                    'Step-by-step personnel profile initialization and compliance verification.',
                  variant: 'muted',
                },
              },
            ],
          },
        ],
      },
    ],
    formFields: [
      {
        id: 'node-ob-firstname',
        type: 'Input',
        schemaVersion: 1,
        layout: { colStart: 1, colSpan: 6 },
        props: { label: 'First Name', placeholder: 'e.g. Alex', required: true },
        binding: {
          field: 'firstName',
          path: '$.data.firstName',
          operation: 'POST /api/onboarding',
        },
      },
      {
        id: 'node-ob-lastname',
        type: 'Input',
        schemaVersion: 1,
        layout: { colStart: 7, colSpan: 6 },
        props: { label: 'Last Name', placeholder: 'e.g. Mercer', required: true },
        binding: { field: 'lastName', path: '$.data.lastName', operation: 'POST /api/onboarding' },
      },
      {
        id: 'node-ob-email',
        type: 'Input',
        schemaVersion: 1,
        layout: { colStart: 1, colSpan: 6 },
        props: {
          label: 'Corporate Email',
          placeholder: 'alex.mercer@enterprise.internal',
          required: true,
        },
        binding: { field: 'email', path: '$.data.email', operation: 'POST /api/onboarding' },
      },
      {
        id: 'node-ob-role',
        type: 'Select',
        schemaVersion: 1,
        layout: { colStart: 7, colSpan: 6 },
        props: {
          label: 'Primary Role / Title',
          options: [
            'Lead Systems Architect',
            'Fullstack Platform Engineer',
            'Security Auditor',
            'Product Specialist',
          ],
          placeholder: 'Select job role',
        },
        binding: { field: 'role', path: '$.data.role', operation: 'POST /api/onboarding' },
      },
      {
        id: 'node-ob-startdate',
        type: 'DatePicker',
        schemaVersion: 1,
        layout: { colStart: 1, colSpan: 6 },
        props: { label: 'Official Start Date', placeholder: 'dd / mm / yyyy' },
        binding: {
          field: 'startDate',
          path: '$.data.startDate',
          operation: 'POST /api/onboarding',
        },
      },
      {
        id: 'node-ob-hardware',
        type: 'Checkbox',
        schemaVersion: 1,
        layout: { colStart: 7, colSpan: 6 },
        props: { label: 'Provision encrypted MacBook Pro with YubiKey MFA', checked: true },
        binding: {
          field: 'hardwareProvisioned',
          path: '$.data.hardware',
          operation: 'POST /api/onboarding',
        },
      },
      {
        id: 'node-ob-submit',
        type: 'Button',
        schemaVersion: 1,
        layout: { colStart: 1, colSpan: 12 },
        props: { label: 'Submit Onboarding Package', variant: 'primary', isSubmit: true },
        binding: { field: 'submit', path: '$.action.submit', operation: 'POST /api/onboarding' },
      },
    ],
  },

  'page-compliance-03': {
    pageId: 'page-compliance-03',
    title: 'Corporate Security & Compliance Policies',
    route: '/compliance',
    description:
      'Enterprise security governance portal. Central repository of mandatory operational standards, encryption policies, and GDPR audit certifications.',
    requiredPermissions: ['security.audit'],
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
                props: {
                  level: 1,
                  text: 'Corporate Security & Compliance Policies',
                  align: 'start',
                },
              },
              {
                id: 'node-header-desc',
                type: 'Text',
                schemaVersion: 1,
                layout: { colStart: 1, colSpan: 8 },
                props: {
                  content:
                    'Centrally enforced cryptographic protocols, role-based boundary validations, and incident response SLAs.',
                  variant: 'muted',
                },
              },
            ],
          },
        ],
      },
    ],
    formFields: [
      {
        id: 'node-comp-accordion',
        type: 'Accordion',
        schemaVersion: 1,
        layout: { colStart: 1, colSpan: 12 },
        props: {
          variant: 'surface',
          hideSeparator: false,
          allowsMultipleExpanded: true,
          isDisabled: false,
          align: 'center',
          maxWidth: '640px',
          titleAlign: 'start',
          dataSource: 'api',
          apiEndpoint: '/api/accordion-items',
          dataPath: '$.data',
          items: [
            {
              id: 'policy-01',
              title: 'Global Data Privacy & GDPR Standards',
              content:
                'All employee records and PII are encrypted at rest with AES-256 and subject to strict ISO 27001 data retention schedules.',
              icon: 'ShieldCheck',
            },
            {
              id: 'policy-02',
              title: 'Dual-Approval Root Key Management',
              content:
                'Production cryptographic master keys require quorum approval by two separate authorized security officers.',
              icon: 'Lock',
            },
            {
              id: 'policy-03',
              title: 'Mandatory Information Security Recertification',
              content:
                'All active team members must complete security awareness refresher training and phishing assessments annually.',
              icon: 'FileText',
            },
            {
              id: 'policy-04',
              title: 'Automated Incident Response SLA',
              content:
                'Severity-1 security events trigger automated paging and multi-region failover procedures within 15 minutes.',
              icon: 'ShieldCheck',
            },
          ],
        },
        binding: {
          field: 'policies',
          path: '$.data.policies',
          operation: 'GET /api/accordion-items',
        },
      },
    ],
  },

  'page-roles-04': {
    pageId: 'page-roles-04',
    title: 'Roles & RBAC Matrix',
    route: '/admin/roles',
    description:
      'Granular role-based access control policies defined across 4 permission tiers with automated least-privilege enforcement.',
    requiredPermissions: ['admin'],
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
                props: { level: 1, text: 'Roles & Permissions Matrix', align: 'start' },
              },
              {
                id: 'node-header-desc',
                type: 'Text',
                schemaVersion: 1,
                layout: { colStart: 1, colSpan: 8 },
                props: {
                  content:
                    'Administrator governance over platform role delegations and API authorization scopes.',
                  variant: 'muted',
                },
              },
            ],
          },
        ],
      },
    ],
    formFields: [
      {
        id: 'node-rbac-role-name',
        type: 'Input',
        schemaVersion: 1,
        layout: { colStart: 1, colSpan: 6 },
        props: { label: 'Role Identifier', placeholder: 'e.g. role-platform-auditor' },
        binding: { field: 'roleName', path: '$.role.name', operation: 'POST /api/roles' },
      },
      {
        id: 'node-rbac-tier',
        type: 'Select',
        schemaVersion: 1,
        layout: { colStart: 7, colSpan: 6 },
        props: {
          label: 'Authorization Tier',
          options: [
            'Tier 1: Public / Visitor',
            'Tier 2: Authenticated Member',
            'Tier 3: Project Developer',
            'Tier 4: Enterprise Administrator',
          ],
          placeholder: 'Select authorization tier',
        },
        binding: { field: 'tier', path: '$.role.tier', operation: 'POST /api/roles' },
      },
      {
        id: 'node-rbac-save',
        type: 'Button',
        schemaVersion: 1,
        layout: { colStart: 1, colSpan: 12 },
        props: { label: 'Update Role Policy', variant: 'primary', isSubmit: true },
        binding: { field: 'submit', path: '$.action.submit', operation: 'POST /api/roles' },
      },
    ],
  },
};
