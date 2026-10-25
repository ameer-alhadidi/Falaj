# How-To: Adding or Updating Project Skills

- **Task ID:** `TSK-P1-04`
- **Domain:** Customization Maintenance

---

## 1. Creating a New Skill

1. Create canonical folder: `.claude/skills/<skill-name>/`
2. Create `SKILL.md` with YAML frontmatter containing `name` and `description`.
3. Mirror to `.agents/skills/<skill-name>/SKILL.md`.

---

## 2. Syncing Skills via Script

```powershell
# Sync all skills from .claude/skills to .agents/skills
Copy-Item -Path ".claude/skills/*" -Destination ".agents/skills/" -Recurse -Force
```
