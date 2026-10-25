---
name: arabic-rtl-engineering
description: Bidirectional layout rules, CSS logical properties, Arabic typography pairing, and canvas coordinate mirroring for English (LTR) and Arabic (RTL).
---

# Arabic and RTL Engineering Skill

Use this skill when developing or reviewing portal views, canvas interactions, components, and site templates to ensure first-class Arabic (RTL) and English (LTR) bidirectional support.

## 1. Core Principles
- **No Physical Directional Properties:** Never use physical CSS properties such as `margin-left`, `margin-right`, `padding-left`, `padding-right`, `left`, `right`, `float: left`, `text-align: left`.
- **CSS Logical Properties Only:**
  - Spacing: `margin-inline-start`, `margin-inline-end`, `padding-inline-start`, `padding-inline-end`, `margin-block`, `padding-block`.
  - Positioning: `inset-inline-start`, `inset-inline-end`, `inset-block-start`, `inset-block-end`.
  - Borders: `border-inline-start`, `border-inline-end`, `border-start-start-radius`, `border-start-end-radius`.
  - Alignment: `text-align: start`, `text-align: end`.
- **Directional Isolation:** Ensure user-generated text inputs and content nodes include `dir="auto"` or preserve their explicit content direction without breaking surrounding platform chrome.

## 2. Typography & Font Pairing
- **Primary Latin Font:** Modern, highly legible neutral sans-serif (e.g. Inter).
- **Companion Arabic Font:** Modern, readable geometric/neo-grotesque Arabic companion (e.g., IBM Plex Sans Arabic or Noto Sans Arabic).
- **Line Height & Baselines:** Arabic scripts require ~15-20% higher line-height (`leading-relaxed` / `1.6–1.7`) compared to Latin to prevent diacritic clipping. Maintain vertical rhythm using relative units (`rem` or `em`).

## 3. 12-Column Grid & Canvas Coordinate Mirroring
- **Column Indexing:**
  - In LTR: Column 1 is at the visual left, Column 12 is at the right.
  - In RTL: Column 1 is at the visual right, Column 12 is at the left.
- **CSS Grid Directionality:** Native CSS Grid with `direction: rtl` automatically mirrors column placement. Always ensure grid containers inherit the current document/canvas direction rather than hardcoding `direction: ltr`.
- **Drag & Drop Sensor Coordinates:** When dragging components across columns in RTL, ensure delta computations (`dnd-kit` coordinate translation) properly account for RTL horizontal sign inversion (`-deltaX`).

## 4. Layout & Chrome Mirroring
| UI Surface | LTR Alignment | RTL Alignment | Notes |
| :--- | :--- | :--- | :--- |
| **Sitemap Tree** | Left sidebar | Right sidebar | Expander arrows point to start, indent via `padding-inline-start`. |
| **Toolbox** | Left sidebar | Right sidebar | Categorized component icons align with text start. |
| **Property Inspector** | Right sidebar | Left sidebar | Input labels and controls align to start. |
| **Breadcrumbs & Paths** | `Home > Pages > Page` | `الصفحة < الصفحات < الرئيسية` | Separator icons flip (`/` remains or chevron mirrors). |
| **Modal / Dialog Actions** | Primary right, cancel left | Primary left, cancel right | Respect platform convention per locale. |

## 5. Automated Verification Checklist
- [ ] Document element has dynamic `dir` and `lang` attributes (`<html dir="rtl" lang="ar">`).
- [ ] No occurrences of `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-` in utility classes or stylesheets.
- [ ] Canvas column drop indicator renders at the exact visual drop column in RTL mode.
- [ ] Text truncation (`overflow: hidden; text-overflow: ellipsis`) functions correctly in both directions without clipping start markers.
