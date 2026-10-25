import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    source: 'Enterprise Policy Registry API',
    total: 4,
    data: [
      {
        id: 'policy-01',
        title: 'Global Data Privacy & GDPR Standards',
        content:
          'All employee records and PII are encrypted at rest with AES-256 and subject to strict ISO 27001 data retention schedules.',
        icon: 'ShieldCheck',
      },
      {
        id: 'policy-02',
        title: 'Dual-Approval Root Key Management',
        content:
          'Production cryptographic master keys require quorum approval by two separate authorized security officers.',
        icon: 'Lock',
      },
      {
        id: 'policy-03',
        title: 'Mandatory Information Security Recertification',
        content:
          'All active team members must complete security awareness refresher training and phishing assessments annually.',
        icon: 'FileText',
      },
      {
        id: 'policy-04',
        title: 'Automated Incident Response SLA',
        content:
          'Severity-1 security events trigger automated paging and multi-region failover procedures within 15 minutes.',
        icon: 'ShieldCheck',
      },
    ],
  });
}
