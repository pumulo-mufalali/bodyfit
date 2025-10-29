# Firebase Deployment Guide

## ⚠️ Understanding the Punycode Warning

The `punycode` deprecation warning is **NOT** an error. It's just a warning from Node.js about a deprecated module used by Firebase CLI. Your deployment should still work.

## 🔍 Finding the Real Error

The actual deployment error will appear **AFTER** the punycode warning. Look for:
- Lines in **red** color
- Text starting with `Error:`
- Text starting with `[error]`
- `Deployment failed` messages

## 📝 Deployment Steps

### Step 1: Build Your App
```bash
# Build the web app
pnpm build:web

# Or build everything
pnpm build
```

### Step 2: Verify Build Output
Check that `apps/web/dist` folder exists and contains:
- `index.html`
- `assets/` folder with JS and CSS files

### Step 3: Deploy to Firebase
```bash
# Standard deployment
pnpm deploy

# Or with debug output (shows more details)
pnpm deploy:debug

# Or manual Firebase command
firebase deploy --only hosting
```

## 🛠️ Common Deployment Issues & Fixes

### Issue 1: "No public directory found"
**Fix:** Make sure `firebase.json` points to `apps/web/dist` and you've run `pnpm build:web`

### Issue 2: "Build failed"
**Fix:** 
- Check for TypeScript errors: `pnpm typecheck`
- Check for lint errors: `pnpm lint`
- Fix any errors before building

### Issue 3: "Permission denied"
**Fix:**
- Login to Firebase: `firebase login`
- Check your Firebase project ID in `.firebaserc`

### Issue 4: "Function setDoc() called with invalid data"
**Fix:** Already fixed! We filter out `undefined` values in `firebase-user-preferences-service.ts`

### Issue 5: Punycode Warning (if you want to suppress it)
Add this to your deployment script:
```bash
NODE_OPTIONS="--no-deprecation" firebase deploy --only hosting
```

Or upgrade Node.js to version 18+ which handles this better.

## 🚀 Quick Deploy Command

```bash
# One command to build and deploy
pnpm deploy
```

## 📋 Pre-Deployment Checklist

- [ ] Built the app (`pnpm build:web`)
- [ ] Verified `apps/web/dist` exists
- [ ] Fixed all TypeScript/linting errors
- [ ] Logged into Firebase (`firebase login`)
- [ ] Firebase project ID is correct in `.firebaserc`
- [ ] `firebase.json` points to `apps/web/dist`

## 🔧 Troubleshooting

If deployment fails:

1. **Run with debug flag:**
   ```bash
   firebase deploy --only hosting --debug
   ```

2. **Check Firebase CLI version:**
   ```bash
   firebase --version
   ```
   Update if outdated: `npm install -g firebase-tools`

3. **Clear Firebase cache:**
   ```bash
   firebase cache:clear
   ```

4. **Check Firebase project:**
   ```bash
   firebase projects:list
   firebase use pumulo-12eb1
   ```

5. **Test locally first:**
   ```bash
   firebase serve --only hosting
   ```
   Visit `http://localhost:5000` to test before deploying.

## 📞 Need Help?

If you still see errors, share:
1. The full error message (scroll past the punycode warning)
2. Output of `firebase --version`
3. Output of `node --version`

