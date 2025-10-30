# Database Seeding Guide

This project includes scripts to seed initial data into Firestore, primarily for populating the exercises collection.

## Prerequisites

1. **Install firebase-admin** (if not already installed):
   ```bash
   pnpm add -D -w firebase-admin
   ```

2. **Set up authentication** (choose one method):
   
   **Option A: Service Account Key (Recommended for CI/CD)**
   - Download service account key from Firebase Console
   - Save as `serviceAccountKey.{env}.json` in project root
   - Example: `serviceAccountKey.dev.json`

   **Option B: Application Default Credentials (For Local Development)**
   ```bash
   # Authenticate with Google Cloud
   gcloud auth application-default login
   ```
   
   **Option C: Firebase Emulator (For Local Development)**
   ```bash
   firebase emulators:start --only firestore
   ```

3. **Configure environment** (if using .env):
   - Ensure `.env`, `.env.dev`, `.env.staging`, or `.env.prod` exists in `apps/web/`
   - Must contain `VITE_FIREBASE_PROJECT_ID`

## Seeding Exercises

### Basic Usage

Seed exercises to the default (dev) environment:
```bash
pnpm seed:exercises
```

Seed to a specific environment:
```bash
pnpm seed:dev        # Seed to development
pnpm seed:staging    # Seed to staging
pnpm seed:prod       # Seed to production
```

### Force Overwrite

To overwrite existing exercises:
```bash
pnpm seed:exercises --force
# or
pnpm seed:dev --force
```

### Direct Script Usage

```bash
# Using default (dev) environment
node scripts/seed-exercises.js

# Specify environment
node scripts/seed-exercises.js --env=dev
node scripts/seed-exercises.js --env=staging
node scripts/seed-exercises.js --env=prod

# Force overwrite existing data
node scripts/seed-exercises.js --env=dev --force
```

## What Gets Seeded

### Exercises Collection

The script seeds 20 exercises organized into 5 categories:

1. **Cardio** (4 exercises)
   - Overhead Reach
   - Jumping Jacks
   - Ice Skaters
   - Toe Taps With Reach

2. **Arms/Strength** (4 exercises)
   - Tricep Box Dips
   - Elevated Push Ups
   - Diamond Push Ups
   - Plank With T Rotation

3. **Legs** (4 exercises)
   - Split Squats
   - Smith Machine Calf Raises
   - Nordic Hamstring Curls
   - Goblet Squats

4. **Abs** (4 exercises)
   - Crunches
   - Russian Twist
   - Side Jack-Knife
   - Jack-knife

5. **Stretches** (4 exercises)
   - Yoga Flow
   - Hamstring Stretch
   - Shoulder Stretch
   - Neck Stretch

Each exercise includes:
- `id`: Unique identifier (ex1, ex2, etc.)
- `name`: Exercise name
- `description`: Exercise description
- `category`: One of: 'cardio', 'strength', 'stretching'
- `imageUrl`: GIF/image URL for the exercise

## Script Behavior

- **Idempotent**: By default, skips exercises that already exist
- **Safe**: Won't overwrite existing data unless `--force` flag is used
- **Environment-aware**: Can seed to different Firebase projects
- **Progress tracking**: Shows which exercises were added, skipped, or had errors

## Example Output

```
✅ Initialized Firebase Admin with project ID: my-project-dev for dev

📦 Seeding exercises to dev environment...

✅ Added: Overhead Reach (cardio)
✅ Added: Jumping Jacks (cardio)
⏭️  Skipped: Ice Skaters (already exists)
✅ Added: Toe Taps With Reach (cardio)
...

📊 Seeding Summary:
   ✅ Added: 18
   ⏭️  Skipped: 2
   ❌ Errors: 0
   📝 Total: 20

🎉 Successfully seeded exercises to dev environment!
```

## Troubleshooting

### "firebase-admin not found"
```bash
pnpm add -D -w firebase-admin
```

### "Failed to initialize Firebase Admin"
- Check that service account file exists and is valid JSON
- Or set `VITE_FIREBASE_PROJECT_ID` in `.env` file
- Or authenticate with `gcloud auth application-default login`
- Or use Firebase Emulator

### "Permission denied" errors
- Ensure service account has Firestore read/write permissions
- Check Firestore security rules allow writes to `exercises` collection
- For development, you may need to temporarily allow public writes or use admin SDK

### Exercises not appearing in app
- Verify the correct environment is selected
- Check that the app is using the same Firebase project
- Ensure Firestore security rules allow reading from `exercises` collection

## Adding New Seed Data

To add more seed data (e.g., achievements, default goals):

1. Create a new seed script: `scripts/seed-{collection}.js`
2. Follow the pattern in `seed-exercises.js`
3. Add to `scripts/seed.js` to include in main seed command
4. Update package.json with new seed commands if needed

## CI/CD Integration

For automated seeding in CI/CD:

```yaml
- name: Seed Database
  env:
    GOOGLE_APPLICATION_CREDENTIALS: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_DEV }}
  run: |
    pnpm seed:dev
```

Or using service account file:
```yaml
- name: Setup Service Account
  run: |
    echo '${{ secrets.FIREBASE_SERVICE_ACCOUNT_DEV }}' > serviceAccountKey.dev.json
    
- name: Seed Database
  run: pnpm seed:dev
```

## Security Notes

- **Never commit** service account keys to version control
- Store service account keys in CI/CD secrets
- Use different service accounts for each environment
- Rotate service account keys periodically
- Service account files are already in `.gitignore`

