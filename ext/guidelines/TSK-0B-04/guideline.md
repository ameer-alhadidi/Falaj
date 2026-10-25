# Guideline: Multi-Theme & RTL Automated Verification Harness

- **Task ID:** `TSK-0B-04`
- **Phase:** Phase 0B
- **Domain:** Visual Regression & Bidirectional Auditing

---

## Architectural Principles & Invariants

1. **Systematic Triad Testing:**
   Every visual surface must be verified across three distinct dimensions:
   - **Viewports:** Desktop (1536×826), Tablet (768×1024), and Mobile (390×844).
   - **Themes:** Dark Mode and Light Mode, with zero un-tokenized color leakage.
   - **Directionality:** LTR (English) and RTL (Arabic `dir="rtl"`).

2. **RTL Mirroring Standards:**
   - Use CSS logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline`) exclusively.
   - Canvas coordinate origins mirror naturally in RTL layout.
   - Directional icons (arrows, chevrons, back/forward buttons) must flip; brand marks and non-directional symbols must remain stable.

3. **Artifact Persistence:**
   - All visual verification sessions produce recorded `.webp` media and timestamped `.png` snapshots saved to the artifact repository.
