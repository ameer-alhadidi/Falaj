# Example: HeroUI Component Specification & Form Binding Schema

- **Task ID:** `TSK-03-02`
- **Phase:** Phase 3
- **Companion Task:** Phase 5 Upstream Data Binding Engine

---

## 1. HeroUI Component Node Definition

Below is the canonical JSON representation of a HeroUI `Input` component dropped inside the Form container:

```json
{
  "id": "node-form-input-8842",
  "type": "Input",
  "schemaVersion": 1,
  "layout": {
    "colStart": 1,
    "colSpan": 6,
    "responsive": {
      "mobile": { "colStart": 1, "colSpan": 12 },
      "tablet": { "colStart": 1, "colSpan": 6 }
    }
  },
  "props": {
    "label": "Full Name",
    "placeholder": "e.g. Sarah Jenkins",
    "required": true,
    "variant": "bordered"
  },
  "binding": {
    "operation": "POST /api/employees",
    "field": "fullName",
    "path": "$.data.employee.fullName",
    "validation": "required, min:2"
  },
  "governance": {
    "allowedByAdmin": true,
    "policyTier": "tier-1-governed"
  }
}
```

---

## 2. Form Container Schema with Nested Child Controls

```json
{
  "id": "node-manager-form",
  "type": "Form",
  "schemaVersion": 1,
  "layout": {
    "colStart": 1,
    "colSpan": 12
  },
  "props": {
    "title": "Employee Onboarding & Registration Form",
    "subtitle": "Spans 12 columns on Desktop grid"
  },
  "binding": {
    "targetOperation": "POST /api/employees",
    "method": "POST",
    "payloadRoot": "$.data.employee"
  },
  "children": [
    {
      "id": "node-field-fullname",
      "type": "Input",
      "layout": { "colStart": 1, "colSpan": 6 },
      "props": { "label": "Full Name", "required": true },
      "binding": { "path": "$.data.employee.fullName" }
    },
    {
      "id": "node-field-dept",
      "type": "Select",
      "layout": { "colStart": 7, "colSpan": 6 },
      "props": { "label": "Department", "options": ["Engineering", "Finance", "HR"] },
      "binding": { "path": "$.data.employee.departmentId" }
    },
    {
      "id": "node-field-hiredate",
      "type": "Calendar",
      "layout": { "colStart": 1, "colSpan": 6 },
      "props": { "label": "Employment Start Date" },
      "binding": { "path": "$.data.employee.startDate" }
    },
    {
      "id": "node-field-submit",
      "type": "Button",
      "layout": { "colStart": 1, "colSpan": 12 },
      "props": { "label": "Save & Dispatch Record", "variant": "primary", "isSubmit": true },
      "binding": { "path": "$.action.submit" }
    }
  ]
}
```

---

## 3. Advanced Picker & OTP Component Definitions

### HeroUI `InputOTP` Component Schema:
```json
{
  "id": "node-form-otp-2011",
  "type": "InputOTP",
  "schemaVersion": 1,
  "layout": { "colStart": 1, "colSpan": 6 },
  "props": {
    "label": "MFA Security Code",
    "length": 6,
    "isRequired": true
  },
  "binding": {
    "operation": "POST /api/auth/mfa/verify",
    "field": "otpToken",
    "path": "$.auth.mfa.code"
  }
}
```

### HeroUI `ColorPicker` Component Schema:
```json
{
  "id": "node-form-color-5510",
  "type": "ColorPicker",
  "schemaVersion": 1,
  "layout": { "colStart": 7, "colSpan": 6 },
  "props": {
    "label": "Tenant Branding Hex Color",
    "defaultValue": "#006FEE",
    "format": "hex"
  },
  "binding": {
    "operation": "PATCH /api/tenants/branding",
    "field": "brandColor",
    "path": "$.data.tenant.branding.primaryColor"
  }
}
```

---

## 4. Developer Tier: Synthesized RFC 9535 Outbound Payload

When a builder submits the form, the runtime resolves all field bindings against the form root:

```json
{
  "operation": "POST /api/employees",
  "timestamp": "2026-10-25T14:30:00Z",
  "payload": {
    "fullName": "Sarah Jenkins",
    "departmentId": "dept-eng-01",
    "startDate": "2026-11-01",
    "hasVpnAccess": true,
    "otpToken": "749201",
    "brandColor": "#006FEE"
  }
}
```

---

## 5. Mirrored HeroUI Prompt Usage Example

Using `ext/heroui/prompts/heroui-system-prompt.md` to scaffold a compliant HeroUI component:

```tsx
import { Card, CardHeader, CardBody, Input, Button } from "@heroui/react";

export function EmployeeCard({ name, title }: { name: string; title: string }) {
  return (
    <Card className="max-w-md">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md font-semibold">{name}</p>
          <p className="text-small text-default-500">{title}</p>
        </div>
      </CardHeader>
      <CardBody>
        <Input label="Direct Line" placeholder="+968 24 123456" variant="bordered" />
        <Button color="primary" className="mt-4">Update Profile</Button>
      </CardBody>
    </Card>
  );
}
```
