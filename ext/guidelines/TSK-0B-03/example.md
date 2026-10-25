# Examples: Admin Gateway & Credential Vault

- **Task ID:** `TSK-0B-03`
- **Domain:** Governance & Security Implementation

---

## 1. Write-Only Credential Vault Component (React / Next.js)

```tsx
interface VaultCardProps {
  apiName: string;
  status: 'SET' | 'NOT_SET';
  keyId: string;
  lastRotated: string;
  onRotate: () => void;
}

export function CredentialVaultCard({ apiName, status, keyId, lastRotated, onRotate }: VaultCardProps) {
  return (
    <div style={{
      background: 'var(--portal-surface-elevated)',
      border: '1px solid var(--portal-border)',
      borderRadius: 'var(--radius-sm)',
      padding: '1rem',
      marginBottom: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontWeight: 600, color: 'var(--portal-text-primary)' }}>{apiName}</span>
          <span style={{
            marginLeft: '8px',
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: '999px',
            background: status === 'SET' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: status === 'SET' ? 'var(--portal-success)' : 'var(--portal-error)'
          }}>
            {status}
          </span>
        </div>
        <button
          onClick={onRotate}
          style={{
            background: 'var(--portal-surface)',
            border: '1px solid var(--portal-border)',
            color: 'var(--portal-text-primary)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          Rotate Credential
        </button>
      </div>

      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
        <div>KMS Key ID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--portal-text-primary)' }}>{keyId}</span></div>
        <div>Last Rotated: {new Date(lastRotated).toLocaleDateString()}</div>
      </div>
    </div>
  );
}
```

---

## 2. Quota Enforcement Middleware Schema (JSON)

```json
{
  "projectId": "proj-corp-portal-01",
  "tier": "enterprise",
  "quotas": {
    "maxPages": 50,
    "currentPages": 12,
    "maxComponentsPerPage": 250,
    "rateLimitRpm": 600
  },
  "status": "active"
}
```
