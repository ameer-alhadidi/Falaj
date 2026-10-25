# How-To: Validate and Evaluate RFC 9535 Bindings

- **Task ID:** `TSK-0B-02`
- **Domain:** Data Mapping Engine & Tree Synchronization

---

## 1. Validating User-Supplied Binding Expressions

When a builder inputs an expression in the Property Inspector:

```typescript
import { validateBindingPath } from './validator';

const result = validateBindingPath(inputExpression);
if (!result.valid) {
  displayError(result.error);
  disableSaveButton();
} else {
  clearError();
  enableSaveButton();
}
```

---

## 2. Binding Evaluation in Dynamic Repeated Components

When rendering a table or collection component:

```typescript
import { evaluateItemExpression } from './evaluator';

export function DynamicRepeaterRow({ item, fieldMappings }: { item: any; fieldMappings: Record<string, string> }) {
  return (
    <tr>
      {Object.entries(fieldMappings).map(([fieldName, expr]) => (
        <td key={fieldName}>
          {String(evaluateItemExpression(expr, item) ?? '')}
        </td>
      ))}
    </tr>
  );
}
```

---

## 3. Simulating Lifecycle States in Prototypes

Prototype 2 supports 4 simulated states for UX testing:

1. **Default:** Live evaluated payload data.
2. **Loading:** Skeleton placeholder animations.
3. **Empty:** Friendly illustration and call to action for 0-record responses.
4. **Error:** Controlled fallback message with retry button when upstream fails.
