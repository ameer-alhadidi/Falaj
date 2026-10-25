# How-To: Admin Gateway & Quota Governance

- **Task ID:** `TSK-0B-03`
- **Domain:** Administration & Credential Workflows

---

## 1. Running the Prototype 3 Server

To launch the Admin & Security Gateway prototype:

```powershell
pnpm --filter prototype-3-admin dev
```
Navigate to `http://localhost:3003` to interact with:
- Project creation and quota validation.
- Write-only credential vault inspection and key rotation.
- Dual-identity realm viewer.
- Audit trail event feed.

---

## 2. Implementing a Safe Credential Mutation Workflow

1. In the UI, click **Rotate Credential** on a registered upstream service.
2. Present a dedicated modal requesting the new secret (token, API key, or certificate).
3. Post the payload directly to the envelope encryption endpoint over TLS.
4. Wipe the local React component state immediately after submission.
5. In the UI, refresh the metadata:
   - `status` remains `SET`
   - `lastRotated` updates to `now()`
   - Generate a signed audit entry: `CREDENTIAL_ROTATED`
