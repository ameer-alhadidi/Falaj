---
name: page-schema
description: Canonical CanvasComponentNode schema definition, RFC 9535 path grammar semantics, and tree validation rules.
---

# Page Schema Skill

Use this skill when defining, validating, serializing, or transforming page layouts, component nodes, and data bindings.

## 1. Canonical `CanvasComponentNode` Shape

All page structures are modeled as typed JSON trees. No executable JavaScript is permitted.

```typescript
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type BreakpointId = 'mobile' | 'tablet' | 'desktop';

interface CanvasComponentNode {
  id: string;                 // Stable UUID/nanoid, never reused across sessions
  type: string;               // Registered component type (e.g., 'Container', 'Table')
  schemaVersion: number;      // Integer schema version for schema migration
  layout: {
    colStart?: number;        // 1-12
    colSpan: number;          // 1-12 (desktop base)
    rowStart?: number;
    rowSpan?: number;
    minHeight?: number;       // Fixed pixel min-height or sizing
    responsive?: Partial<Record<BreakpointId, {
      colStart?: number;
      colSpan?: number;
      visible?: boolean;
    }>>;
  };
  props: Record<string, JsonValue>;   // Strictly validated against the component type schema
  visibility?: {
    requiredPermissions: string[];    // Client and server enforced access control
  };
  children?: CanvasComponentNode[];
  binding?: {
    apiOperationId: string;
    collectionPath?: string;          // `$`-rooted RFC 9535 expression
    totalPath?: string;               // `$`-rooted total count expression
    fieldMappings?: Record<string, string>; // `@`-rooted item relative expressions
  };
}
```

## 2. Binding Path Semantics (RFC 9535 Subset)

The data binding engine relies on a strict, security-reviewed subset of RFC 9535 syntax:

- `$` refers to the **response root** (used for collections and metadata):
  - Valid: `$.data`, `$.items[*]`, `$.pagination.total`
- `@` refers to the **current collection item** (used inside repeated templates):
  - Valid: `@.id`, `@.name`, `@.department.name`, `@['first name']`

### Allowed Selectors:
1. Root identifier `$`
2. Current item identifier `@`
3. Dot property access (`.field`)
4. Quoted bracket property access (`['field name']`)
5. Non-negative integer array index (`[0]`)
6. Wildcard array unpack (`[*]`) - collection paths only

### Disallowed Selectors (Must Reject on Validation):
- Filter expressions (`?()`)
- Function extensions (`match()`, `search()`)
- Regular expressions
- Recursive descent (`..`)
- Slices (`[0:5]`) and negative indices (`[-1]`)

## 3. Conformance & Validation Rules
- Reversible Serialization: Page schemas must round-trip cleanly between Rust `serde` models and TypeScript Zod schemas.
- Stable IDs: Reordering or updating node properties must never alter node `id`.
- Rejection of Unknown Fields: Both client and server must reject unknown attributes on inbound payloads.
- Path Validation on Save: Binding expressions are validated at save time against the grammar, not deferred to render time.
