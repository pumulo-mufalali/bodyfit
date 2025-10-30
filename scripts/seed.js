#!/usr/bin/env node

/**
 * Main seeding script that runs all seed operations
 * Usage: node scripts/seed.js [--env=dev|staging|prod] [--force] [--exercises]
 */

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const envArg = args.find(arg => arg.startsWith('--env='));
const env = envArg ? envArg.split('=')[1] : 'dev';
const force = args.includes('--force');
const exercisesOnly = args.includes('--exercises');

console.log(`🌱 Starting database seeding for ${env} environment...\n`);

// Build command arguments
const seedArgs = [`--env=${env}`];
if (force) {
  seedArgs.push('--force');
}

// Seed exercises
console.log('📦 Seeding exercises...\n');
const exercisesScript = spawn('node', [
  path.join(__dirname, 'seed-exercises.js'),
  ...seedArgs
], {
  stdio: 'inherit',
  shell: true
});

exercisesScript.on('close', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Exercises seeding failed with code ${code}`);
    process.exit(code);
  }
  
  console.log(`\n✅ All seeding operations completed successfully!`);
  process.exit(0);
});

exercisesScript.on('error', (error) => {
  console.error('❌ Error running seed script:', error);
  process.exit(1);
});

