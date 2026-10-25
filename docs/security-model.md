# Security Architecture & Threat Model
## Enterprise Visual Website Development Platform

- **Status:** Approved Draft (Phase 0A)
- **Author:** Principal Application Security Engineer
- **Scope:** Upstream Broker, Authentication, Authorization Tiers, Secret Storage, CSRF

---

## 1. System Trust Boundaries & Threat Landscape

```
  [ UNTRUSTED PUBLIC INTERNET / BROWSER ]
                   |
     (HTTPS / Strict SameSite Cookies)
                   |
  =================v=============================================================
  TRUST BOUNDARY 1: PORTAL / VISITOR RUNTIME INGRESS (Next.js Edge / BFF)
  ===============================================================================
                   |
     (mTLS / Internal Pod Network / Request Correlation ID)
                   |
  =================v=============================================================
  TRUST BOUNDARY 2: PLATFORM API & BROKER (Rust Axum Service)
  ===============================================================================
                   |                               |
       (Encrypted DB Connection)     (Custom DNS Resolved / SSRF Blocked)
                   |                               |
  =================v=============     =============v=============================
  TRUST BOUNDARY 3: POSTGRESQL        TRUST BOUNDARY 4: UPSTREAM ENTERPRISE APIS
  (Envelope Encrypted Secrets)        (Core HR, Payroll, ERP)
  ===============================     ===========================================
```

---

## 2. Upstream API Broker & SSRF Defense Architecture (Section 7.2)

The platform backend acts as a hardened gateway between frontend clients and sensitive upstream enterprise services. Outbound requests are subjected to multi-layered defenses:

### 2.1 Complete IP Blocklist Specification
The broker rejects any socket connection attempting to reach non-routable, loopback, private, or infrastructure metadata IP ranges across both IPv4 and IPv6:

| Category | IPv4 Ranges | IPv6 Ranges / Mapped Forms | Rationale |
| :--- | :--- | :--- | :--- |
| **Loopback** | `127.0.0.0/8` | `::1/128`, `::ffff:127.0.0.0/104` | Blocks access to local host services. |
| **Private (RFC 1918)** | `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` | `fc00::/7` (ULA) | Prevents intranet resource probing. |
| **Link-Local** | `169.254.0.0/16` | `fe80::/10` | Blocks local network interface traffic. |
| **Cloud Metadata** | `169.254.169.254/32` | `::ffff:169.254.169.254`, `fd00:ec2::254` | Prevents AWS/GCP/Azure instance credential theft. |
| **CGNAT** | `100.64.0.0/10` | N/A | Carrier-grade NAT boundary isolation. |
| **Multicast / Unspecified** | `224.0.0.0/4`, `0.0.0.0/8` | `ff00::/8`, `::/128` | Prevents broadcast and 0.0.0.0 bind attacks. |

### 2.2 DNS Rebinding Mitigation with `hickory-resolver`
Standard HTTP clients perform DNS resolution in a disconnected step, allowing a malicious DNS server to return a benign IP on initial check and a private IP when the socket connects (Time-of-Check to Time-of-Use race condition).

**The Solution:**
1. **Custom Connector:** The Rust `reqwest` client is configured with a custom DNS resolver powered by `hickory-resolver`.
2. **Synchronous Validation:** The custom resolver intercepts DNS responses and filters out any IP matching the blocklist *before* the socket handoff.
3. **Single Resolution Step:** The socket connects strictly and directly to the validated IP address.
4. **Preserved TLS SNI & Verification:**
   - The original requested hostname is sent as the TLS Server Name Indication (SNI).
   - The upstream X.509 certificate is verified against the original hostname (preventing man-in-the-middle).
   - The HTTP `Host` header transmits the original hostname.
   - *Under no circumstances is certificate verification disabled.*

### 2.3 Manual Redirect Handling & Proxy Isolation
- **Automatic Redirects Disabled:** Client enforces `redirect::Policy::none()`.
- **Manual Hop Inspection:** When a `301`, `302`, `307`, or `308` status code is received, the redirect target URL is extracted and completely re-validated against the integration allowlist and custom DNS blocklist.
- **Hop Limit:** Redirect chains are strictly capped at 3 hops; exceeding 3 hops aborts with `ERR_SSRF_REDIRECT_LIMIT`.
- **No System Proxies:** The client is built using `.no_proxy()`, preventing `HTTP_PROXY` or `HTTPS_PROXY` environment variables from routing requests around IP filters.

---

## 3. Four Independent Authorization Layers (Section 8)

Authorization is strictly enforced by the server; client-side visibility toggles are treated merely as cosmetic UX aids.

```
Incoming Request (e.g. GET /api/published/pages/managers)
     |
     v
[ LAYER 1: Page Access ] ------------> Has 'managers.read'?
     | Yes                                 | No -> Return 403 Forbidden / Redirect Login
     v
[ LAYER 2: Component Visibility ] ---> For each component node:
     |                                    Has required permissions (e.g. 'payroll.read')?
     |                                    - If No: Strip node and children from AST payload
     v
[ LAYER 3: API Operation Access ] ---> Broker checks if user session has operation permission
     |                                    (e.g. 'employees.read'). If missing, abort API call.
     v
[ LAYER 4: Project Administration ] -> (Builder context only) Verify user is assigned to project.
```

---

## 4. Secret Storage & Envelope Encryption (Section 9.3)

All upstream authentication credentials (OAuth2 client secrets, API tokens) are encrypted before reaching disk:

```
[ Key Management Service (KMS) / HashiCorp Vault / Master Key ]
                          |
             Generates Data Encryption Key (DEK)
                          |
                          v
         +---------------------------------+
         |     Local AES-256-GCM Engine    |
         |                                 |
         |  Secret Payload  +  DEK  +  IV  |
         +----------------+----------------+
                          |
                          v
       [ Encrypted Payload + Encrypted DEK + Auth Tag ]
                          |
                          v
             Written to PostgreSQL Storage
```

- **Write-Only Security in UI:** The Portal UI displays credentials only as `Status: Configured` and `Last Rotated: [Timestamp]`. The raw secret is never sent back to the browser.
- **Audit Logging:** Every decryption event performed by the broker logs: `timestamp`, `operation_id`, `actor_id`, and `latency`. Secrets are never recorded in logs or error messages.

---

## 5. Mutation Defense & Anti-CSRF Architecture (Section 7.4)

Form submissions and button mutation actions (POST/PUT/DELETE) enforce:
1. **SameSite Cookie Controls:** Session cookies use `SameSite=Lax` or `Strict` with `HttpOnly` and `Secure`.
2. **Double-Submit / Origin Verification:** Mutating endpoints verify the `Origin` and `Sec-Fetch-Site` headers against the approved project domain.
3. **Idempotency Safeguard:** Mutations are never retried automatically on network failure unless explicitly flagged as `is_idempotent: true` in the API registry.
