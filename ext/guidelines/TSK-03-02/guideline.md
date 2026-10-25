# Guideline: HeroUI Component Drawer, Administrator Governance & Form Canvas

- **Task ID:** `TSK-03-02`
- **Phase:** Phase 3
- **Domain:** Visual Studio Canvas & 3-Tier Persona Architecture

---

## Architectural Principles & Invariants

1. **3-Tier Persona Separation of Concerns:**
   - **Tier 1 (Administrator Governance):** Project-level authority that dictates which components from the enterprise design system (HeroUI palette) are permitted for use. When a component is restricted by an administrator, the platform enforces this restriction at compile time and runtime—builders cannot place the component onto any canvas or form container.
   - **Tier 2 (Builder Canvas Assembly):** Visual designers and site builders select permitted components from the HeroUI component drawer and drop them onto the 12-column grid or into responsive container blocks (e.g. `<Form>`). Builders configure layout (`colSpan`, `colStart`), visual properties (`label`, `placeholder`, `variant`), and structure without touching raw code.
   - **Tier 3 (Developer Data-Binding & Mutations):** Engineers and technical developers map form inputs and visual repeaters to upstream APIs (queries and mutations) using strict RFC 9535 JSONPath expressions (`$.data.employee[fieldName]`), validation schemas, and anti-CSRF mutating endpoints.

2. **HeroUI Aesthetic & Design System Fidelity:**
   - The component catalog sidebar must replicate HeroUI's design language:
     - Prominent "All Components (React)" top pill with real-time component counts.
     - Semantic categorization (Form Controls, Layout, Interactive, Data Display, Feedback, Navigation).
     - Distinct status pills for components: `New` (pink soft pill), `Updated` (violet soft pill), and `Admin Restricted` (warning amber pill with lock icon).
     - Clean typography and subtle hover elevations driven exclusively by `--portal-*` tokens.

3. **Form Container Drop Zone Semantics:**
   - Any dropped component within a Form container (`#node-manager-form`) is structured as an explicit child node inside the form's schema.
   - Dropped controls inherit grid column spans (defaulting to 6 columns for inputs/selects/dates, 12 columns for buttons/checkbox groups) and receive unique, monotonic node identifiers.
   - The form container provides an active visual drop target with dashed boundary highlighting and state transition on drag-over.

4. **Zero Hardcoded Colors & WCAG 2.2 AA Contrast:**
   - All borders, backgrounds, text values, and focus rings must bind directly to CSS variables (`--portal-bg`, `--portal-surface`, `--portal-border-active`, `--portal-text-primary`, `--portal-accent`, etc.).
   - Support seamless transitions between Light and Dark themes, as well as full Arabic RTL mirroring (`IBM Plex Sans Arabic`, `dir="rtl"`).
