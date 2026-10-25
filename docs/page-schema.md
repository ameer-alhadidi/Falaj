# Page Schema & Path Grammar Specification
## Canonical CanvasComponentNode & RFC 9535 Subset

- **Status:** Approved Draft (Phase 0A)
- **Author:** Lead Systems Architect / Language Designer
- **Package Location:** `packages/page-schema`

---

## 1. Canonical `CanvasComponentNode` Shape

All visual pages, templates, and layouts are serialized as immutable, validated JSON Abstract Syntax Trees (AST). No executable JavaScript or expressions are permitted within page definitions.

```typescript
export type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonValue[] 
  | { [key: string]: JsonValue };

export type BreakpointId = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveLayoutOverride {
  colStart?: number;         // 1 to 12
  colSpan?: number;          // 1 to 12
  rowStart?: number;
  rowSpan?: number;
  visible?: boolean;         // Breakpoint visibility toggle
}

export interface NodeLayout {
  colStart?: number;         // 1 to 12 (Desktop base)
  colSpan: number;           // 1 to 12 (Desktop base, mandatory)
  rowStart?: number;
  rowSpan?: number;
  minHeight?: number;        // Fixed pixel minimum height or row sizing
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  responsive?: Partial<Record<BreakpointId, ResponsiveLayoutOverride>>;
}

export interface DataBindingDefinition {
  apiOperationId: string;                 // UUID of registered api_operations
  collectionPath?: string;                // `$`-rooted collection expression, e.g. "$.data"
  totalPath?: string;                     // `$`-rooted pagination count expression, e.g. "$.total"
  fieldMappings?: Record<string, string>; // `@`-rooted item relative expressions, e.g. {"name": "@.name"}
}

export interface ComponentVisibilityPolicy {
  requiredPermissions: string[];         // Tier 2: Component visibility permissions
}

export interface CanvasComponentNode {
  id: string;                             // Stable UUID, never regenerated during moves/edits
  type: string;                           // Registered component identifier (e.g. 'Table', 'Button')
  schemaVersion: number;                  // Integer version for automatic schema migrations
  layout: NodeLayout;                     // 12-column grid placement and responsive overrides
  props: Record<string, JsonValue>;       // Validated against the registered component schema
  visibility?: ComponentVisibilityPolicy; // Server-evaluated access control
  binding?: DataBindingDefinition;        // Declarative REST API mapping
  children?: CanvasComponentNode[];       // Nested component nodes (containers, stacks, grids)
}
```

---

## 2. RFC 9535 Binding Path Grammar Specification

The data binding engine uses a strict, safe subset of RFC 9535 syntax with one explicit extension: **`@` is a standalone item-relative root** (representing the current item in a repeated template).

### 2.1 Formal EBNF Grammar

```ebnf
PathExpression      ::= RootExpression | ItemExpression ;

RootExpression      ::= '$' ( ChildSelector )* ;
ItemExpression      ::= '@' ( ChildSelector )* ;

ChildSelector       ::= DotProperty | BracketProperty | ArrayIndex | WildcardArray ;

DotProperty         ::= '.' Identifier ;
BracketProperty     ::= '[' SingleQuotedString ']' ;
ArrayIndex          ::= '[' NonNegativeInteger ']' ;
WildcardArray       ::= '[*]' ;

Identifier          ::= [a-zA-Z_] [a-zA-Z0-9_]* ;
SingleQuotedString  ::= "'" ( [^'\\] | '\\' . )* "'" ;
NonNegativeInteger  ::= '0' | [1-9] [0-9]* ;
```

### 2.2 Prohibited Features (Security & Determinism Gate)
The following constructs are **explicitly forbidden** and must be rejected at parse time during validation:
1. **Filter Expressions:** `?(@.price > 100)` (disallowed to prevent ReDoS and arbitrary logic injection).
2. **Function Extensions:** `length()`, `match()`, `search()` (disallowed).
3. **Recursive Descent:** `..` (disallowed to guarantee linear $O(N)$ evaluation time).
4. **Negative Array Indices & Slices:** `[-1]`, `[0:5]` (disallowed).
5. **Multiple Wildcard Descents:** Wildcard `[*]` is permitted only as the terminating selector on collection root paths.

---

## 3. Path AST Representation

The path grammar parses into a simple, strongly-typed AST shared identically across Rust (`page_schema::ast::Path`) and TypeScript (`@visual-platform/page-schema`):

### TypeScript AST
```typescript
export type PathRoot = '$' | '@';

export type PathSegment = 
  | { kind: 'property'; name: string }
  | { kind: 'index'; index: number }
  | { kind: 'wildcard' };

export interface ParsedPath {
  root: PathRoot;
  segments: PathSegment[];
  raw: string;
}
```

### Rust AST
```rust
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum PathRoot {
    ResponseRoot,   // '$'
    CurrentItem,    // '@'
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum PathSegment {
    Property(String),
    Index(usize),
    Wildcard,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ParsedPath {
    pub root: PathRoot,
    pub segments: Vec<PathSegment>,
    pub raw: String,
}
```

---

## 4. Evaluation Semantics & Employee Directory Example

Given the upstream response from `GET /api/employees`:
```json
{
  "status": "success",
  "data": [
    {
      "id": 101,
      "name": "Ahmed Al-Harthy",
      "department": { "name": "Finance", "code": "FIN" },
      "jobTitle": "Finance Manager",
      "contact": { "email": "ahmed@example.com" },
      "active": true
    }
  ],
  "total": 1
}
```

### Path Evaluation Matrix:
| Evaluation Target | Path Expression | Resolved Value | Notes |
| :--- | :--- | :--- | :--- |
| Collection Root | `$.data` | `[ { id: 101, ... } ]` | Supplies repeater collection items |
| Total Count | `$.total` | `1` | Supplies pagination component |
| Item ID | `@.id` | `101` | Bound to Table column 1 |
| Employee Name | `@.name` | `"Ahmed Al-Harthy"` | Bound to Table column 2 |
| Department Name | `@.department.name` | `"Finance"` | Nested object traversal |
| Email Contact | `@.contact.email` | `"ahmed@example.com"` | Bound to email link |
| Status Flag | `@.active` | `true` | Formatted via adapter to "Active" |

---

## 5. Dual-Language Conformance Suite Design

To ensure exact evaluation parity between the Rust backend (used during pre-rendering and broker validation) and the TypeScript frontend (used in the live visual canvas):
- A shared JSON test suite is stored in `packages/page-schema/conformance/`:
  - `valid-paths.json`: Positive test vectors with input JSON, path string, and expected extracted JSON.
  - `invalid-paths.json`: Malformed or prohibited syntax test vectors with expected error codes (`ERR_DISALLOWED_FILTER`, `ERR_INVALID_SYNTAX`, `ERR_NEGATIVE_INDEX`).
- **CI Enforcement:** `cargo test` in `packages/page-schema-rs` and `pnpm test` in `packages/page-schema-ts` execute against the identical test files on every pull request.
