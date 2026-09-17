# HITFACT — SECURITY & PRIVACY

## Authentication

Use a trusted authentication provider or proven auth implementation.
Never store plain-text passwords.

## Authorization

Every protected action must be checked server-side. Frontend visibility
is not security.

## Admin

- mandatory 2FA where supported
- strong sessions
- role-based access
- audit logs
- re-authentication for critical actions

## Input security

Validate: - text - URLs - HTML/rich text - IDs - dates - file uploads -
form fields

Prevent: - XSS - SQL injection - CSRF - SSRF where applicable - path
traversal - malicious uploads

## Upload security

- allowlist file types
- enforce file size
- inspect MIME/signature
- store outside executable web roots
- generate safe filenames
- scan where infrastructure supports it

## Abuse protection

Rate-limit: - login - registration - comments - likes - votes - form
submissions - reports - password reset

Add anti-bot measures when abuse appears.

## Privacy

Collect only necessary data. Provide: - privacy policy - terms - account
deletion - data export where required - consent controls

Do not publish private email, phone or account data.

## Editorial safety

For accusations or sensitive claims: - require evidence/source fields -
preserve source history - support corrections - maintain audit trail

## Backups

Database backups Media backups Configuration/secret recovery plan
Restore testing

Never commit secrets to Git.
