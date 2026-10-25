# Guideline: Authoring and Mirroring Agent Skills

- **Task ID:** `TSK-P1-04`
- **Phase:** Phase −1
- **Domain:** Project Customization & Agent Standards

---

## Architectural Principles & Invariants

1. **Dual Location Mirroring:**
   - Skills are defined with canonical versions in `.claude/skills/<skill-name>/SKILL.md`.
   - Skills must be mirrored identically to `.agents/skills/<skill-name>/SKILL.md` to ensure seamless discovery across Antigravity IDE and subagents.

2. **YAML Frontmatter Standard:**
   - Every `SKILL.md` must start with structured frontmatter:
     ```yaml
     ---
     name: <skill-name>
     description: <Concise, action-oriented trigger summary>
     ---
     ```

3. **Domain Coverage:**
   - Mandatory project skills:
     - `enterprise-studio-tokens`
     - `page-schema`
     - `security-review`
     - `phase-report`
     - `podman-dev`
     - `arabic-rtl-engineering`
     - `wcag-accessibility-audit`
