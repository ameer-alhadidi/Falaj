# Guideline: Security, Path Grammar & Accessibility Audits

- **Task ID:** `TSK-0A-02`
- **Phase:** Phase 0A
- **Domain:** Security Model, RFC 9535 Syntax & WCAG 2.2 AA Contrast

---

## Architectural Principles & Invariants

1. **SSRF Mitigation Invariants:**
   - Outbound requests to user-configured APIs must resolve through a custom DNS resolver (`hickory-resolver`).
   - Validate destination IP addresses against RFC 1918, RFC 6598, link-local, and loopback ranges prior to socket connection.
   - Prohibit automatic redirect following; every redirect hop must re-enter DNS validation.

2. **RFC 9535 Expression Grammar Invariants:**
   - Prohibit any expression capable of non-linear execution time (recursive descent `..`, regex search, arbitrary functions, filter queries `?()`).
   - Restrict syntax to deterministic JSON dot and bounded bracket navigation.

3. **WCAG 2.2 AA Accessibility Invariants:**
   - All text and foreground elements must achieve mathematical contrast:
     - Normal body text $\ge 4.5:1$
     - Large text ($\ge 18\text{pt}$ or $14\text{pt}$ bold) and interactive boundaries $\ge 3.0:1$
   - Corrected token standards:
     - Dark mode muted text: `#94a3b8` on `#090a0f` ($6.5:1$)
     - Dark mode accent foreground: `#090a0f` on `#3b82f6` ($4.6:1$)
