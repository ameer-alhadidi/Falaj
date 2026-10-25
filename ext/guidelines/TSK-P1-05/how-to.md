# How-To: Logging Decisions and Updating Tooling

- **Task ID:** `TSK-P1-05`
- **Domain:** Documentation Workflows

---

## 1. Recording a New Decision

1. Open `docs/outstanding-decisions.md`.
2. Locate the next sequential decision number (e.g. `DEC-013`).
3. Add the title, status, date, decision text, rationale, and reversibility rating.
4. If this supersedes an earlier decision, update the previous entry's status to `Superseded by DEC-XXX`.

---

## 2. Updating Tooling Specifications

When upgrading dependencies or compiler toolchains:
1. Update version tables in `docs/tooling.md`.
2. Update verify scripts to reflect newly minimum-required versions.
