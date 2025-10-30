# Multi-Environment Configuration Guide

This project supports multiple environments: **development**, **staging**, and **production**. Each environment uses its own Firebase project and configuration.

## Environment Overview

- **dev** - Development environment for local development and testing
- **staging** - Staging environment for pre-production testing
- **prod** - Production environment for live users

## Setup Instructions

### 1. Create Firebase Projects

Create three separate Firebase projects (or use aliases for existing projects):

1. **Development Project**: `http://localhost:5173`
2. **Staging Project**: `your-project-staging`
3. **Production Project**: `https://pumulo-12eb1.web.app`

### 2. Configure Firebase Projects

Update `.firebaserc` with your actual project IDs:

```json
{
  "projects": {
    "default": "your-default-project",
    "dev": "your-dev-project-id",
    "staging": "your-staging-project-id",
    "prod": "your-prod-project-id"
  }
}
```

### 3. Create Environment Files

For each environment, create the corresponding `.env` file in `apps/web/`:

#### Development Environment
```bash
# Copy the example file
cp apps/web/.env.dev.example apps/web/.env.dev

# Edit and fill in your development Firebase credentials
```

#### Staging Environment
```bash
# Copy the example file
cp apps/web/.env.staging.example apps/web/.env.staging

# Edit and fill in your staging Firebase credentials
```

#### Production Environment
```bash
# Copy the example file
cp apps/web/.env.prod.example apps/web/.env.prod

# Edit and fill in your production Firebase credentials
```

### 4. Environment File Template

Each environment file should contain:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID masuk-your-app-id

# tRPC Endpoint
VITE_TRPC_ENDPOINT=https://us-central1-your-project.cloudfunctions.net/trpc

# Environment Mode
VITE_ENV=dev  # or 'staging' or 'prod'
```

## Switching Environments

### Using Scripts

Switch to a specific environment:

```bash
# Switch to development
pnpm env:dev

# Switch to staging
pnpm env:staging

# Switch to production
pnpm env:prod

# Interactive switch (prompts for environment)
pnpm env:switch
```

### Manual Switch

Manually copy the environment file:

```bash
# Switch to development
cp apps/web/.env.dev apps/web/.env

# Switch to staging
cp apps/web/.env.staging apps/web/.env

# Switch to production
cp apps/web/.env.prod apps/web/.env
```

### Switch Firebase Project

After switching the environment file, switch the Firebase project:

```bash
firebase use dev      # For development
firebase use staging  # For staging
firebase use prod     # For production
```

## Deployment

### Deploy to Specific Environment

```bash
# Deploy to development
pnpm deploy:dev

# Deploy to staging
pnpm deploy:staging

# Deploy to production
pnpm deploy:prod
```

These commands will:
1. Switch to the correct environment configuration
2. Build the web app
3. Switch Firebase project
4. Deploy hosting, Firestore rules, and indexes

### Deploy Functions to Specific Environment

```bash
# Deploy functions to development
pnpm deploy:functions:dev

# Deploy functions to staging
pnpm deploy:functions:staging

# Deploy functions to production
pnpm deploy:functions:prod
```

### Manual Deployment Steps

1. **Switch environment**:
   ```bash
   pnpm env:dev  # or staging/prod
   ```

2. **Switch Firebase project**:
   ```bash
   firebase use dev  # or staging/prod
   ```

3. **Build and deploy**:
   ```bash
   pnpm build:web
   firebase deploy --only hosting,firestore:rules,firestore:indexes
   ```

## CI/CD Integration

For GitHub Actions or other CI/CD pipelines, use environment-specific secrets:

### GitHub Actions Example

```yaml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: pnpm install
      - run: pnpm env:staging
      - run: pnpm build:web
      
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_STAGING }}'
          projectId: your-staging-project-id
          channelId: zat
```

## Environment Variables in CI/CD

Store environment-specific secrets in your CI/CD platform:

- `FIREBASE_SERVICE_ACCOUNT_DEV`
- `FIREBASE_SERVICE_ACCOUNT_STAGING`
- `FIREBASE_SERVICE_ACCOUNT_PROD`

Or store the entire `.env` file contents as secrets:
- `ENV_DEV`
- `ENV_STAGING`
- `ENV_PROD`

## Best Practices

1. **Never commit `.env` files** - They are already in `.gitignore`
2. **Use different Firebase projects** - Keep environments completely isolated
3. **Test in staging** - Always test deployments in staging before production
4. **Document project IDs** - Keep track of which Firebase projects map to which environment
5. **Use Firebase project aliases** - Makes switching projects easier
6. **Validate environment** - Check that you're deploying to the correct environment before deploying

## Troubleshooting

### Environment not switching

If the environment doesn't switch:
1. Check that `.env.dev`, `.env.staging`, or `.env.prod` exists
2. Verify the file was copied to `.env`
3. Restart your development server (`pnpm dev`)

### Wrong Firebase project

If deploying to the wrong project:
1. Check current project: `firebase projects:list`
2. Switch project: `firebase use <env>`
3. Verify: `firebase use`

### Missing environment variables

If environment variables are missing:
1. Check that your `.env` file exists in `apps/web/`
2. Verify all required variables are set
3. Restart your development server
4. Check console for warnings about missing variables

## Security Notes

- **Never commit** `.env`, `.env.dev`, `.env.staging`, or `.env.prod` files
- Store production credentials securely (e.g., GitHub Secrets, CI/CD secrets)
- Use Firebase project-level security rules
- Rotate API keys periodically
- Use different service accounts for each environment

