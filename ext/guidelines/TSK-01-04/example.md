# Examples: Design System Consumption

- **Task ID:** `TSK-01-04`
- **Domain:** Design System Implementation

---

## 1. Importing Tokens in Next.js Root Layout

```tsx
// apps/studio/src/app/layout.tsx
import '@falaj/design-system/tokens.css';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
```

---

## 2. Using Tokens in CSS Modules / Vanilla CSS

```css
.card {
  background-color: var(--portal-surface-elevated);
  border: 1px solid var(--portal-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  color: var(--portal-text-primary);
}

.button-primary {
  background-color: var(--portal-accent);
  color: var(--portal-accent-foreground);
  border-radius: var(--radius-sm);
  padding-inline: 1rem;
  padding-block: 0.5rem;
}
```
