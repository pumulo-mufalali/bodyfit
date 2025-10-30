#!/usr/bin/env node

/**
 * Script to switch between different Firebase environments
 * Usage: node scripts/switch-env.js [dev|staging|prod]
 */

const fs = require('fs');
const path = require('path');

const env = process.argv[2] || 'dev';
const validEnvs = ['dev', 'staging', 'prod'];

if (!validEnvs.includes(env)) {
  console.error(`❌ Invalid environment: ${env}`);
  console.error(`   Valid environments: ${validEnvs.join(', ')}`);
  process.exit(1);
}

const webDir = path.join(__dirname, '..', 'apps', 'web');
const envFile = path.join(webDir, `.env.${env}`);
const targetFile = path.join(webDir, '.env');

// Check if environment file exists
if (!fs.existsSync(envFile)) {
  console.error(`❌ Environment file not found: ${envFile}`);
  console.error(`   Please create ${envFile} from ${envFile}.example`);
  process.exit(1);
}

// Copy environment file to .env
try {
  fs.copyFileSync(envFile, targetFile);
  console.log(`✅ Switched to ${env} environment`);
  console.log(`   Copied ${envFile} to ${targetFile}`);
  
  // Also switch Firebase project
  const firebasercPath = path.join(__dirname, '..', '.firebaserc');
  if (fs.existsSync(firebasercPath)) {
    const firebaserc = JSON.parse(fs.readFileSync(firebasercPath, 'utf8'));
    if (firebaserc.projects && firebaserc.projects[env]) {
      console.log(`\n💡 To switch Firebase project, run:`);
      console.log(`   firebase use ${env}`);
    }
  }
} catch (error) {
  console.error(`❌ Failed to switch environment:`, error.message);
  process.exit(1);
}

