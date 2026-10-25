# Examples: Desktop Studio Canvas Implementation

- **Task ID:** `TSK-0B-01`
- **Domain:** React / Next.js Component Patterns

---

## 1. Immutable Node Update Pattern (Preserving Stable IDs)

```typescript
import { CanvasComponentNode } from '@visual-platform/page-schema';

export function updateComponentProperty(
  nodes: CanvasComponentNode[],
  targetNodeId: string,
  key: string,
  value: any
): CanvasComponentNode[] {
  return nodes.map(node => {
    if (node.id === targetNodeId) {
      return {
        ...node,
        props: {
          ...node.props,
          [key]: value,
        },
      };
    }
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: updateComponentProperty(node.children, targetNodeId, key, value),
      };
    }
    return node;
  });
}
```

---

## 2. 12-Column Responsive CSS Grid Container

```tsx
export function CanvasGridOverlay({ showGuides }: { showGuides: boolean }) {
  if (!showGuides) return null;

  return (
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
        gap: 'var(--space-3)',
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
            borderInlineStart: '1px dashed var(--portal-border-active)',
            borderInlineEnd: '1px dashed var(--portal-border-active)',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '4px',
            fontSize: 'var(--font-size-xs)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--portal-accent)',
            opacity: 0.6,
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}
```
