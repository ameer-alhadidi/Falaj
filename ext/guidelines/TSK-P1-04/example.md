# Examples: Skill Template & Directory Structure

- **Task ID:** `TSK-P1-04`
- **Domain:** Skill Definition

---

## 1. Minimal Canonical Skill Example (`SKILL.md`)

```markdown
---
name: enterprise-studio-tokens
description: Authoritative token definitions, theme mode guidelines (light/dark/system), and hardcoded-color prevention checks.
---

# Enterprise Studio Tokens

## Authoritative Rules
- Use CSS custom properties: `var(--portal-bg-base)`, `var(--portal-accent)`.
- Never use hex values `#ffffff` or `rgba()`.
- Meet WCAG 2.2 AA contrast standards.
```

---

## 2. Directory Layout

```text
d:/work/Falaj/
├── .claude/skills/
│   ├── enterprise-studio-tokens/SKILL.md
│   ├── page-schema/SKILL.md
│   └── ...
└── .agents/skills/
    ├── enterprise-studio-tokens/SKILL.md
    ├── page-schema/SKILL.md
    └── ...
```
