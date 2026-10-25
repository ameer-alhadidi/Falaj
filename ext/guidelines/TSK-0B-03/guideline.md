# Guideline: Admin Gateway & Security Management

- **Task ID:** `TSK-0B-03`
- **Phase:** Phase 0B
- **Domain:** Governance, Quota Restrictions & Credential Vault

---

## Architectural Principles & Invariants

1. **Write-Only Secrets in Frontend Surfaces:**
   - Raw API credentials, OAuth client secrets, and bearer tokens must **never** be rendered, transmitted, or returned in API responses to the frontend.
   - The UI displays only metadata: `Status: SET | NOT_SET`, `KMS Key ID`, and `Last Rotated Timestamp`.
   - Re-entering a credential performs an overwrite; retrieving the raw secret via client API is architecturally impossible.

2. **Dual Identity Segregation:**
   - **Builder Identity:** Studio admins, page authors, API configurators (Keycloak Realm `Platform-Builders`).
   - **Site-Visitor Identity:** End-users browsing published tenant applications (Keycloak Realm `Tenant-Visitors`).
   - Sessions, cookies, and tokens between these two realms must remain completely separate with no token exchange or trust leakage.

3. **Quota & Rate-Limiting Governance:**
   - Every project operates under strict resource caps:
     - `maxPages` (e.g., 25–100)
     - `maxComponentsPerPage` (e.g., 200–500)
     - `rateLimitRpm` (e.g., 120–1000 RPM)
   - Exceeding quotas must trigger graceful HTTP 429 / 403 errors with actionable upgrade guidance.

4. **Tamper-Evident Audit Logging:**
   - All state mutations (credential rotations, quota updates, project creations) generate immutable audit records with actor UUID, IP address, timestamp, and action description.
