# Component Adapter Contract Specification
## Canonical Logical Components & shadcn/ui Implementation

- **Status:** Approved Draft (Phase 0A)
- **Author:** Lead Frontend Architect
- **Package Location:** `packages/component-adapters`
- **Initial Implementation:** `packages/component-adapters/shadcn`

---

## 1. Adapter Philosophy & Contract Structure

To ensure that page schemas (`CanvasComponentNode`) remain decoupled from specific frontend UI libraries, all rendering is mediated through an **Adapter Contract**. 

Every logical component defines:
1. **Component Descriptor:** Type name, display name, category, and icon.
2. **Capability Flags:** Structural and data characteristics (`canHaveChildren`, `supportsDataBinding`, `supportsMutation`).
3. **Props Schema:** Strongly-typed property definitions validated via Zod.
4. **Slots & State Models:** Child insertion slots and state handling (default, loading, error, empty).
5. **Renderer Function:** React component implementation mapping logical props to library primitives.

Through Phase 5, **only the `shadcn/ui` adapter** is implemented. HeroUI and daisyUI adapters will be introduced post-Phase 6 with explicit capability matrices.

---

## 2. Logical Component Catalog & Capability Matrix (Section 6.4)

| Component Type | Category | Capabilities | Primary Logical Props | shadcn/ui Primitive |
| :--- | :--- | :--- | :--- | :--- |
| `Container` | Layout | `canHaveChildren: true` | `maxWidth`, `padding`, `background` | `<div>` with Tailwind utilities |
| `Section` | Layout | `canHaveChildren: true` | `as` (`section`, `header`, `footer`), `spacing` | Semantic HTML element |
| `Grid` | Layout | `canHaveChildren: true` | `columns` (1–12), `gap`, `alignItems` | CSS Grid container |
| `Stack` | Layout | `canHaveChildren: true` | `direction` (`row`, `col`), `gap`, `wrap` | Flexbox container |
| `Card` | Layout | `canHaveChildren: true` | `title`, `description`, `footer`, `bordered` | `Card`, `CardHeader`, `CardContent` |
| `Heading` | Typography | `supportsDataBinding: true` | `level` (1–6), `text`, `align` | `<h1>`–`<h6>` with typography classes |
| `Text` | Typography | `supportsDataBinding: true` | `content`, `variant` (`body`, `muted`, `caption`) | `<p>`, `<span>` |
| `Link` | Typography | `supportsDataBinding: true` | `href`, `label`, `external` | `<a>` or Next.js `<Link>` |
| `Image` | Media | `supportsDataBinding: true` | `src`, `alt`, `width`, `height`, `fit` | Next.js `<Image>` |
| `Icon` | Media | None | `name` (Lucide icon identifier), `size`, `color` | `lucide-react` icons |
| `Badge` | Display | `supportsDataBinding: true` | `label`, `variant` (`default`, `secondary`, `outline`) | `Badge` |
| `Alert` | Display | `canHaveChildren: true` | `title`, `message`, `variant` (`info`, `warning`, `destructive`) | `Alert`, `AlertTitle`, `AlertDescription` |
| `Button` | Interactive| `supportsMutation: true` | `label`, `variant`, `actionType`, `apiOperationId` | `Button` |
| `Input` | Form | `supportsMutation: true` | `name`, `label`, `placeholder`, `type`, `required` | `Input`, `Label` |
| `Form` | Form | `canHaveChildren: true`, `mutation: true` | `apiOperationId`, `method`, `onSuccessMessage` | `<form>` with form state |
| `Select` | Form | `supportsDataBinding: true` | `name`, `label`, `options` (or bound collection) | `Select`, `SelectTrigger`, `SelectContent` |
| `Checkbox` | Form | `supportsMutation: true` | `name`, `label`, `defaultChecked` | `Checkbox`, `Label` |
| `Tabs` | Interactive| `canHaveChildren: true` | `items` (tab label & content slot), `defaultValue` | `Tabs`, `TabsList`, `TabsContent` |
| `Modal` / `Dialog`| Interactive| `canHaveChildren: true` | `triggerLabel`, `title`, `description` | `Dialog`, `DialogTrigger`, `DialogContent` |
| `Table` | Collection | `supportsDataBinding: true` | `columns`, `collectionPath`, `totalPath`, `emptyText` | `Table`, `TableHeader`, `TableBody`, `TableRow` |
| `Repeater` | Collection | `canHaveChildren: true`, `binding: true` | `collectionPath`, `emptyState` | Dynamic map of child template |
| `Pagination` | Collection | `supportsDataBinding: true` | `totalPath`, `pageSize`, `currentPage` | `Pagination`, `PaginationContent` |
| `Breadcrumb` | Navigation | `supportsDataBinding: true` | `segments` (path array) | `Breadcrumb`, `BreadcrumbItem` |
| `NavigationMenu`| Navigation | `canHaveChildren: true` | `brand`, `items` (routes and sub-menus) | `NavigationMenu`, `NavigationMenuList` |
| `Sidebar` | Navigation | `canHaveChildren: true` | `collapsible`, `position` (`start`, `end`) | `Sidebar` / Sheet primitive |

*(Note: In accordance with Section 6.4, `Chart` is deferred until a dedicated charting specification and adapter contract are approved).*

---

## 3. Data-Bound Table & Repeater Contract Example

### Table Props Schema
```typescript
export interface TableColumnMapping {
  header: string;           // E.g. "Department"
  mappingPath: string;      // E.g. "@.department.name" (RFC 9535 `@`-rooted)
  format?: 'text' | 'currency' | 'date' | 'badge';
  sortable?: boolean;
}

export interface TableProps {
  columns: TableColumnMapping[];
  emptyText?: string;
  loadingText?: string;
}
```

### Table Adapter Implementation (shadcn/ui)
```tsx
export function ShadcnTableAdapter({ node, boundData, isLoading, isError }: AdapterProps<TableProps>) {
  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading records...</div>;
  }
  if (isError) {
    return <div className="p-4 text-center text-destructive">Failed to load table data.</div>;
  }
  
  const items = Array.isArray(boundData) ? boundData : [];
  if (items.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">{node.props.emptyText || "No records found."}</div>;
  }

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          {node.props.columns.map((col, idx) => (
            <TableHead key={idx} className="text-start">{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((rowItem, rowIdx) => (
          <TableRow key={rowIdx}>
            {node.props.columns.map((col, colIdx) => {
              const cellValue = evaluateItemPath(col.mappingPath, rowItem);
              return (
                <TableCell key={colIdx} className="text-start">
                  {formatValue(cellValue, col.format)}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```
