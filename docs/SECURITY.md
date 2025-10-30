# Security Documentation

This document outlines security practices, requirements, and reviews for the MyFitness application.

## Two-Factor Authentication (2FA)

### Repository Requirements

**All contributors and maintainers MUST enable 2FA on their GitHub accounts.**

- **Requirement:** Two-factor authentication is mandatory for all repository collaborators
- **Verification:** GitHub organization/repository settings enforce 2FA requirement
- **Supported Methods:**
  - TOTP apps (Google Authenticator, Authy, Microsoft Authenticator)
  - SMS (as backup)
  - Security keys (recommended for high-privilege accounts)

### Setup Instructions

1. Go to GitHub Settings → Security → Two-factor authentication
2. Choose your preferred 2FA method (TOTP app recommended)
3. Scan QR code with your authenticator app
4. Verify the setup with a test code
5. Save backup codes securely

### For Repository Administrators

To enforce 2FA for all collaborators:
1. Go to repository Settings → Security
2. Enable "Require two-factor authentication for this organization"
3. Verify all current members have 2FA enabled

## Dependency Scanning

### Dependabot Configuration

This repository uses GitHub Dependabot for automated dependency scanning and updates.

**Location:** `.github/dependabot.yml`

**Features:**
- Weekly dependency updates (Mondays at 9:00 AM)
- Automatic security vulnerability scanning
- Pull request creation for updates
- Grouped updates (production vs development dependencies)
- Automatic security update merging (if configured)

**What Gets Scanned:**
- npm/PNPM dependencies (`package.json`)
- GitHub Actions workflows
- Direct dependencies only (transitive dependencies require manual review)

### Manual Dependency Audits

Run periodic dependency audits:

```bash
# Check for known vulnerabilities
pnpm audit

# Fix automatically fixable issues
pnpm audit --fix

# Check outdated packages
pnpm outdated
```

## Secrets Management

### T3 Env Pattern

This project uses the T3 Env pattern for type-safe environment variable management.

**Location:** `apps/web/src/env.ts`

**Benefits:**
- Type-safe environment variable access
- Runtime validation of required variables
- Build-time checks for missing variables
- Prevents accidentally committing secrets

### Environment Variables

**Required Variables:**
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain (URL format)
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID

**Optional Variables:**
- `VITE_FIREBASE_STORAGE_BUCKET` - Storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Messaging sender ID
- `VITE_TRPC_ENDPOINT` - tRPC endpoint URL
- `VITE_ENV` - Environment (dev/staging/prod)

### Secrets Storage

**Never commit secrets to version control:**
- ✅ All `.env` files are in `.gitignore`
- ✅ Use GitHub Secrets for CI/CD
- ✅ Use Firebase Functions config for server-side secrets

**For CI/CD:**
Store secrets in GitHub Secrets:
- `FIREBASE_SERVICE_ACCOUNT_DEV`
- `FIREBASE_SERVICE_ACCOUNT_STAGING`
- `FIREBASE_SERVICE_ACCOUNT_PROD`

**For Firebase Functions:**
Use `functions:config`:
```bash
firebase functions:config:set someservice.key="THE API KEY"
```

## OWASP Top-10 Security Review

This section documents how the application addresses the OWASP Top-10 security risks.

### A01:2021 – Broken Access Control

**Status:** ✅ Addressed

**Implementation:**
- Firestore security rules enforce user-scoped data access
- Authentication required for all data operations
- User ID validation in tRPC context
- Protected routes in frontend (`ProtectedRoute.tsx`)

**Firestore Rules:**
```javascript
function isOwner(userId) {
  return isAuthenticated() && request.auth.uid == userId;
}
// All collections require isOwner() checks
```

**Mitigations:**
- Principle-of-least-privilege enforced
- User can only access their own data
- No cross-user data access possible

### A02:2021 – Cryptographic Failures

**Status:** ✅ Addressed

**Implementation:**
- Firebase Authentication handles password hashing (bcrypt/Argon2)
- All API communication over HTTPS
- No sensitive data stored in plain text
- Environment variables properly secured

**Firebase Auth:**
- Passwords never stored in application
- Firebase handles all cryptographic operations
- Token-based authentication

**HTTPS:**
- All Firebase services use HTTPS
- Firebase Hosting enforces HTTPS
- No HTTP endpoints exposed

### A03:2021 – Injection

**Status:** ✅ Addressed

**Implementation:**
- Zod schema validation on all inputs (tRPC)
- Firestore rules validate input types
- Input sanitization in services
- No raw database queries (Firestore SDK prevents SQL injection)

**Validation Layers:**
1. **Frontend:** Form validation with Zod
2. **tRPC:** Zod schema validation
3. **Firestore Rules:** Type and value validation

**Example:**
```typescript
// tRPC validates input
.input(UserSchema.partial())

// Firestore rules validate
request.resource.data.weight is number
request.resource.data.weight > 0
```

### A04:2021 – Insecure Design

**Status:** ✅ Addressed

**Implementation:**
- Security-by-design architecture
- User-scoped data model (users can't access others' data)
- Authentication required at multiple layers
- Defense in depth approach

**Security Layers:**
1. Frontend: Protected routes
2. API: tRPC authentication context
3. Database: Firestore security rules
4. Network: HTTPS enforcement

### A05:2021 – Security Misconfiguration

**Status:** ✅ Addressed

**Implementation:**
- Secure default configurations
- Environment-specific configurations
- No default credentials
- Security rules deployed automatically

**Firebase Configuration:**
- Security rules are version-controlled
- Rules deployment automated in CI/CD
- Separate configs for dev/staging/prod

**Environment Management:**
- Multi-environment setup prevents prod config leakage
- Environment variables validated at build time

### A06:2021 – Vulnerable and Outdated Components

**Status:** ✅ Addressed

**Implementation:**
- Dependabot for automated dependency scanning
- Regular dependency audits (`pnpm audit`)
- Package lock file ensures consistent versions
- Automated security updates via Dependabot

**Dependency Management:**
- PNPM lockfile ensures reproducible builds
- Weekly dependency scans (Dependabot)
- Security alerts via GitHub

### A07:2021 – Identification and Authentication Failures

**Status:** ✅ Addressed

**Implementation:**
- Firebase Authentication (industry-standard)
- Session management handled by Firebase
- Token-based authentication
- No password storage in application

**Authentication Features:**
- Firebase Auth handles all auth logic
- Secure token management
- Automatic token refresh
- Logout functionality

### A08:2021 – Software and Data Integrity Failures

**Status:** ✅ Addressed

**Implementation:**
- Package lock files ensure integrity
- CI/CD pipeline validates all changes
- TypeScript prevents type-related issues
- Firestore rules validate data integrity

**Integrity Checks:**
- PNPM lockfile ensures package integrity
- TypeScript compilation validates code
- Firestore rules validate data structure
- CI/CD runs tests before deployment

### A09:2021 – Security Logging and Monitoring Failures

**Status:** ⚠️ Partial

**Implementation:**
- Firebase console logs available
- Error logging in application (`error-handler.ts`)
- Activity logging for user actions

**Gaps:**
- No centralized logging dashboard
- No alerting configured
- No monitoring dashboards

**Recommendations:**
- Set up Cloud Logging dashboards
- Configure alerts for security events
- Implement log aggregation (Sentry, LogRocket)

### A10:2021 – Server-Side Request Forgery (SSRF)

**Status:** ✅ Addressed

**Implementation:**
- No user-controlled URLs in server requests
- tRPC endpoints are internal
- Firebase functions don't make external HTTP requests based on user input
- All external requests are predefined

**Mitigations:**
- No URL parameters used for server requests
- All API endpoints are typed and validated
- No dynamic URL construction from user input

## Security Best Practices

### Code Security

1. **Never commit secrets** - Use environment variables and GitHub Secrets
2. **Validate all inputs** - Use Zod schemas for type safety
3. **Principle of least privilege** - Users can only access their own data
4. **Keep dependencies updated** - Run `pnpm audit` regularly
5. **Use HTTPS everywhere** - No HTTP endpoints

### Development Security

1. **Enable 2FA** on all accounts
2. **Review Dependabot PRs** regularly
3. **Run security audits** before major releases
4. **Test security rules** in emulator before deployment
5. **Document security decisions** in this file

### Deployment Security

1. **Separate environments** - Use different Firebase projects
2. **Deploy rules first** - Always deploy Firestore rules before data
3. **Validate environment** - Check you're deploying to correct environment
4. **Review logs** - Check deployment logs for errors
5. **Test in staging** - Always test security rules in staging

## Security Incident Response

If a security vulnerability is discovered:

1. **DO NOT** create a public issue
2. Email security team or create private security advisory
3. Fix the vulnerability promptly
4. Deploy fix to all environments
5. Update this document with lessons learned

## Regular Security Tasks

- **Weekly:** Review Dependabot PRs
- **Monthly:** Run `pnpm audit` and fix vulnerabilities
- **Quarterly:** Review and update security rules
- **Annually:** Conduct full security audit

## References

- [OWASP Top-10 2021](https://owasp.org/Top10/)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [T3 Env Documentation](https://env.t3.gg/)

