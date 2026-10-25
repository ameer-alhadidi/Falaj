---
name: phase-report
description: Template and standard structure for the end-of-phase acceptance report required before requesting phase sign-off.
---

# Phase Report Skill

Use this skill at the conclusion of each phase (Section 12) to produce an authoritative acceptance report.

## Report Structure

Every phase report must follow this standard format:

```markdown
# Phase [Phase Number] Acceptance Report: [Phase Title]

## 1. Executive Summary
- Brief statement of phase objectives and delivery status (Completed / Partial / Blocked).

## 2. Deliverables Checklist
- [x] Deliverable 1: [Description and link to file/package]
- [x] Deliverable 2: [Description and link to file/package]

## 3. Verification & Automated Test Results
- Unit and Integration Tests: [Tool used, total passing, duration, coverage metrics]
- Static Analysis & Lint: [Results from clippy, cargo fmt, eslint, prettier, tsc]
- Security Audits: [Results from cargo-audit, cargo-deny, security-review checklist]

## 4. Live Demonstration & Verification Evidence
- Commands executed and outputs observed.
- Screenshot artifacts (for UI deliverables) in light, dark, and RTL formats.
- Container/infrastructure logs proving rootless operation.

## 5. Outstanding Decisions & Architectural Records
- Notable decisions recorded in `docs/outstanding-decisions.md` during this phase.
- Rationale and reversibility assessment.

## 6. Known Limitations & Technical Debt
- Any non-blocking gaps or deferred non-functional enhancements.

## 7. Next Phase Readiness & Sign-Off Request
- Clear declaration that all exit criteria for the current phase are satisfied.
- Formal request for user approval before initiating the next phase.
```
