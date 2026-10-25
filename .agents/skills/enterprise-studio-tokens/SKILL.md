---
name: enterprise-studio-tokens
description: Authoritative token definitions, theme mode guidelines (light/dark/system), and hardcoded-color prevention checks for the Enterprise Studio design system.
---

# Enterprise Studio Tokens Skill

Use this skill when designing, reviewing, or styling any component or view in the visual platform portal.

## 1. Core Principles
- Single Source of Truth: All styling in the portal must consume CSS custom properties defined in `packages/design-system` (theme ID: `enterprise-studio`).
- Zero Hardcoded Colors: Never use raw hex (`#ffffff`), rgb/rgba, or Tailwind utility colors (`bg-blue-600`, `text-slate-500`) directly in portal components. Always use semantic tokens.
- Theme Modes: Full support for Light, Dark, and System modes without hydration mismatch or visual flashes.
- RTL Compatibility: All spacing, alignment, and directional layouts must use CSS logical properties (`margin-inline-start`, `padding-inline`, `border-inline-end`).

## 2. Core Token Reference

### Non-Color Tokens (Root)
```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

### Color Tokens (Per Mode)
| Token Name | Light Value | Dark Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--portal-bg` | `#f8fafc` | `#090a0f` | Main canvas / outer application background |
| `--portal-surface` | `#ffffff` | `#11131b` | Panels, toolboxes, dialogs, cards |
| `--portal-surface-elevated` | `#ffffff` | `#171b26` | Dropdowns, popovers, elevated modals |
| `--portal-border` | `#e2e8f0` | `#232938` | Structural dividing borders |
| `--portal-border-active` | `#2563eb` | `#3b82f6` | Active input, focused state, selection border |
| `--portal-text-primary` | `#0f172a` | `#f8fafc` | Headings, primary body text |
| `--portal-text-secondary` | `#475569` | `#94a3b8` | Subtext, labels, secondary metadata |
| `--portal-text-muted` | `#64748b` | `#94a3b8`* | Captions, placeholders (*WCAG audited) |
| `--portal-accent` | `#2563eb` | `#3b82f6` | Interactive buttons, selected nodes |
| `--portal-accent-hover` | `#1d4ed8` | `#2563eb` | Hover states on primary interactive elements |
| `--portal-success` | `#059669` | `#10b981` | Success alerts, publication confirmations |
| `--portal-warning` | `#b45309` | `#f59e0b` | Warnings, unsaved changes, deprecation notices |
| `--portal-error` | `#dc2626` | `#ef4444` | Validation errors, failed API calls |
| `--canvas-grid-line` | `rgba(37, 99, 235, 0.10)` | `rgba(59, 130, 246, 0.12)` | 12-column grid guide lines |
| `--canvas-grid-active` | `rgba(37, 99, 235, 0.28)` | `rgba(59, 130, 246, 0.35)` | Active drop target column highlights |

## 3. WCAG 2.2 AA Contrast Compliance
- Text contrast must achieve at least 4.5:1 for body copy and 3.0:1 for large text / UI component borders.
- Suspect pair resolution: Dark mode muted text on dark background must be audited and boosted to at least `#94a3b8` to satisfy 4.5:1. White text on dark accent `#3b82f6` must be verified or paired with dark text if needed.

## 4. Quality & Lint Check
Before finalizing any component:
1. Search code for raw hex `#` or rgb strings.
2. Confirm logical property usage (no `margin-left` or `padding-right`).
3. Verify light, dark, and system rendering via theme toggle.
