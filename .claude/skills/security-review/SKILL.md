---
name: security-review
description: Security review checklist covering SSRF protection, DNS rebinding mitigation, 4-tier authorization, CSRF, and secret management.
---

# Security Review Skill

Apply this checklist before every phase sign-off and during code review of backend broker, persistence, and portal components.

## 1. Upstream API Broker & SSRF Defense

The Rust backend brokers all external/upstream calls. Verify:

- [ ] Blocked IP Ranges: The broker explicitly blocks private (RFC 1918), loopback (`127.0.0.0/8`, `::1`), link-local (`169.254.0.0/16`, `fe80::/10`), CGNAT (`100.64.0.0/10`), multicast, unspecified (`0.0.0.0`), and cloud metadata services (`169.254.169.254`, IPv6 equivalents, IPv4-mapped IPv6 `::ffff:169.254.169.254`).
- [ ] No DNS Rebinding Gap: DNS resolution and socket connection happen synchronously using a custom resolver (`hickory-resolver`). The socket connects *only* to validated IPs.
- [ ] TLS Verification Maintained: TLS SNI and certificate validation check against the original requested hostname, never the pinned IP.
- [ ] Manual Redirect Validation: Client automatic redirects are disabled (`redirect::Policy::none()`). Each redirect hop is manually checked against allowlists and IP blocklists (max 3 hops).
- [ ] System Proxy Bypass Disabled: The HTTP client enforces `no_proxy()`, preventing `HTTP_PROXY` environment variables from circumventing IP filters.
- [ ] Secret Redaction: All logs, metrics, and error outputs redact authorization tokens, query secrets, and request payloads.

## 2. Four Independent Authorization Tiers

Verify that access control is enforced on the server at each independent layer:

1. **Page Access Layer:** Can an unauthorized user navigate or SSR-render the page? (Must return 403 or redirect to login).
2. **Component Visibility Layer:** Does the server strip components and bound data if the user lacks the component-level permission? (Hiding via CSS is not sufficient).
3. **API Operation Layer:** Does the broker verify that the user's site session or builder session has the required permission identifier before dispatching the request?
4. **Project Administration Layer:** Can a developer read or modify projects to which they are not assigned?

## 3. Session & Secret Management

- [ ] Dual Identity Separation: Builder identity (portal) and Site-Visitor identity (published sites) are strictly segregated in tokens, sessions, and databases.
- [ ] Cookies: Session cookies must be `HttpOnly`, `Secure`, and `SameSite=Lax` or `Strict`.
- [ ] CSRF: Mutating requests require SameSite validation plus anti-CSRF token or Origin header verification.
- [ ] Envelope Encryption: Sensitive upstream credentials in PostgreSQL are encrypted with data keys, protected by a master KMS/Vault key.
- [ ] Write-Only UI: Credentials in the UI are displayed only as "Set" / "Not Set" and last rotated date; values are never returned to the client.
