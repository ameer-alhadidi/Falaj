# Examples: Binding Evaluation & Validation

- **Task ID:** `TSK-0B-02`
- **Domain:** Data Mapping Engine

---

## 1. Item-Relative Expression Evaluator (TypeScript)

```typescript
export function evaluateItemExpression(expression: string, itemRecord: any): any {
  if (!expression.startsWith('@.')) {
    throw new Error(`Invalid item expression: ${expression}. Must start with '@.'`);
  }

  const pathSegments = expression.slice(2).split('.');
  let currentTarget = itemRecord;

  for (const segment of pathSegments) {
    if (currentTarget == null) return null;
    currentTarget = currentTarget[segment];
  }

  return currentTarget ?? null;
}
```

---

## 2. Binding Definition JSON Structure

```json
{
  "apiOperationId": "op-core-hr-employees",
  "collectionPath": "$.data",
  "totalPath": "$.total",
  "fieldMappings": {
    "id": "@.id",
    "name": "@.name",
    "department": "@.department.name",
    "jobTitle": "@.jobTitle",
    "email": "@.email",
    "active": "@.active"
  }
}
```
