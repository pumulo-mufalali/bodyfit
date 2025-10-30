#!/usr/bin/env node

/**
 * Script to seed exercises collection in Firestore
 * Usage: node scripts/seed-exercises.js [--env=dev|staging|prod] [--force]
 */

// Try to use firebase-admin if available, otherwise provide helpful error
let admin;
try {
  admin = require('firebase-admin');
} catch (error) {
  console.error('❌ firebase-admin not found.');
  console.error('   Please install it: pnpm add -D -w firebase-admin');
  console.error('   Then run this script again.');
  process.exit(1);
}

const path = require('path');
const fs = require('fs');

// Parse command line arguments
const args = process.argv.slice(2);
const envArg = args.find(arg => arg.startsWith('--env='));
const env = envArg ? envArg.split('=')[1] : 'dev';
const force = args.includes('--force');

// Exercise data from exercise-categories.ts
const exerciseCategories = [
  {
    category: 'Cardio',
    exercises: [
      { id: 'ex1', name: 'Overhead Reach', description: 'Full body cardio movement combining squat and overhead reach', imageUrl: 'https://media.self.com/photos/61157d860fba8918ef07da15/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-01%2520Squat%2520to%2520Overhead%2520Reach-min.gif', category: 'cardio' },
      { id: 'ex2', name: 'Jumping Jacks', description: 'Classic cardio exercise for full body warm-up', imageUrl: 'https://media.self.com/photos/61157e25553830ba14166ef2/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-02%2520Modified%2520Jumping%2520Jacks-min.gif', category: 'cardio' },
      { id: 'ex3', name: 'Ice Skaters', description: 'Lateral cardio movement improving balance and coordination', imageUrl: 'https://media.self.com/photos/611581f6c66629131d52d34f/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-13%2520Ice%2520Skaters-min.gif', category: 'cardio' },
      { id: 'ex4', name: 'Toe Taps With Reach', description: 'Dynamic cardio exercise targeting core and legs', imageUrl: 'https://media.self.com/photos/61157ed6e1b6f66010ac3706/master/w_1600%2Cc_limit/SE_SEN_07_032_Cardio_GIF-04%2520Toe%2520Taps%2520With%2520Reach-min.gif', category: 'cardio' },
    ]
  },
  {
    category: 'Arms',
    exercises: [
      { id: 'ex5', name: 'Tricep Box Dips', description: 'Upper body strength exercise targeting triceps', imageUrl: 'https://media.self.com/photos/5c4a2f33203e3933090ec27b/master/w_1600%2Cc_limit/tricep-box-dips-Amanda_093.gif', category: 'strength' },
      { id: 'ex6', name: 'Elevated Push Ups', description: 'Modified push-up variation for building upper body strength', imageUrl: 'https://media.self.com/photos/5c4a2e2601584d32459c06ce/master/w_1600%2Cc_limit/elevated-push-up-Amanda_091.gif', category: 'strength' },
      { id: 'ex7', name: 'Diamond Push Ups', description: 'Advanced push-up variation targeting triceps and chest', imageUrl: 'https://media.self.com/photos/5c41fa45a9cd1e7eb7fd0f2b/master/w_1600%2Cc_limit/diamond-push-up-Amanda_079.gif', category: 'strength' },
      { id: 'ex8', name: 'Plank With T Rotation', description: 'Core and upper body exercise with rotational movement', imageUrl: 'https://media.self.com/photos/5c4b2809a9cd1e7eb7fd0f4d/master/w_1600%2Cc_limit/plank-with-t-rotation-Amanda_041.gif', category: 'strength' },
    ]
  },
  {
    category: 'Legs',
    exercises: [
      { id: 'ex9', name: 'Split Squats', description: 'Unilateral leg exercise for strength and balance', imageUrl: 'https://barbend.com/wp-content/uploads/2023/04/split-squat-barbend-movement-gif-masters.gif', category: 'strength' },
      { id: 'ex10', name: 'Smith Machine Calf Raises', description: 'Isolated calf exercise for lower leg development', imageUrl: 'https://barbend.com/wp-content/uploads/2024/04/smith-machine-calf-raise-barbend-movement-gif-masters-1.gif', category: 'strength' },
      { id: 'ex11', name: 'Nordic Hamstring Curls', description: 'Eccentric hamstring exercise for posterior chain strength', imageUrl: 'https://barbend.com/wp-content/uploads/2023/03/nordic-hamstring-curl-barbend-movement-gif-masters.gif', category: 'strength' },
      { id: 'ex12', name: 'Goblet Squats', description: 'Full-body squat variation with front-loaded weight', imageUrl: 'https://barbend.com/wp-content/uploads/2023/12/goblet-squat-barbend-movement-gif-masters.gif', category: 'strength' },
    ]
  },
  {
    category: 'Abs',
    exercises: [
      { id: 'ex13', name: 'Crunches', description: 'Classic abdominal exercise for core strength', imageUrl: 'https://i.imgur.com/UJAnRhJ.gif', category: 'strength' },
      { id: 'ex14', name: 'Russian Twist', description: 'Rotational core exercise targeting obliques', imageUrl: 'https://i.imgur.com/PG6vgpl.gif', category: 'strength' },
      { id: 'ex15', name: 'Side Jack-Knife', description: 'Lateral core exercise for oblique development', imageUrl: 'https://i.imgur.com/HjyLvkX.gif', category: 'strength' },
      { id: 'ex16', name: 'Jack-knife', description: 'Advanced core exercise combining leg raise and crunch', imageUrl: 'https://i.imgur.com/CBH7Ejv.gif', category: 'strength' },
    ]
  },
  {
    category: 'Stretches',
    exercises: [
      { id: 'ex17', name: 'Yoga Flow', description: 'Flowing yoga sequence for flexibility and mobility', imageUrl: 'https://assets.vogue.com/photos/5891df45fb0604bf1f5c6056/master/w_1600,c_limit/karlie-stretch-1.gif', category: 'stretching' },
      { id: 'ex18', name: 'Hamstring Stretch', description: 'Static stretch for posterior chain flexibility', imageUrl: 'https://assets.vogue.com/photos/5891df4a9c1609bf7a72e2eb/master/w_1600,c_limit/karlie-stretch-4.gif', category: 'stretching' },
      { id: 'ex19', name: 'Shoulder Stretch', description: 'Upper body stretch for shoulder mobility', imageUrl: 'https://assets.vogue.com/photos/5891df4b12a7b1df212c840d/master/w_1600,c_limit/karlie-stretch-5.gif', category: 'stretching' },
      { id: 'ex20', name: 'Neck Stretch', description: 'Gentle stretch for neck and upper cervical spine', imageUrl: 'https://assets.vogue.com/photos/5891df48fb0604bf1f5c6058/master/w_1600,c_limit/karlie-stretch-3.gif', category: 'stretching' },
    ]
  },
];

async function seedExercises() {
  try {
    // Initialize Firebase Admin
    // Check if already initialized
    if (admin.apps.length > 0) {
      console.log('✅ Firebase Admin already initialized');
    } else {
      let serviceAccount;
      const serviceAccountPath = path.join(__dirname, '..', `serviceAccountKey.${env}.json`);
      
      if (fs.existsSync(serviceAccountPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id
        });
        console.log(`✅ Initialized Firebase Admin with service account for ${env}`);
      } else {
        // Try to use environment variables or application default credentials
        // Load env vars from .env file if it exists
        const webDir = path.join(__dirname, '..', 'apps', 'web');
        const envFile = path.join(webDir, `.env.${env}`);
        const defaultEnvFile = path.join(webDir, '.env');
        
        let projectId;
        if (fs.existsSync(envFile) || fs.existsSync(defaultEnvFile)) {
          const envContent = fs.existsSync(envFile) 
            ? fs.readFileSync(envFile, 'utf8')
            : fs.readFileSync(defaultEnvFile, 'utf8');
          const projectMatch = envContent.match(/VITE_FIREBASE_PROJECT_ID=(.+)/);
          if (projectMatch) {
            projectId = projectMatch[1].trim();
          }
        }
        
        if (projectId) {
          admin.initializeApp({
            projectId: projectId
          });
          console.log(`✅ Initialized Firebase Admin with project ID: ${projectId} for ${env}`);
        } else {
          // Use application default credentials (requires gcloud auth or emulator)
          try {
            admin.initializeApp();
            console.log(`✅ Initialized Firebase Admin with default credentials for ${env}`);
          } catch (error) {
            console.error('❌ Failed to initialize Firebase Admin.');
            console.error('   Please provide one of the following:');
            console.error(`   1. Service account file: ${serviceAccountPath}`);
            console.error('   2. Set VITE_FIREBASE_PROJECT_ID in .env file and use:');
            console.error('      gcloud auth application-default login');
            console.error('   3. Use Firebase Emulator:');
            console.error('      firebase emulators:start --only firestore');
            process.exit(1);
          }
        }
      }
    }

    const db = admin.firestore();
    const exercisesRef = db.collection('exercises');

    console.log(`\n📦 Seeding exercises to ${env} environment...\n`);

    let added = 0;
    let skipped = 0;
    let errors = 0;

    // Flatten exercises from categories
    const allExercises = exerciseCategories.flatMap(category => 
      category.exercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        description: ex.description || `${ex.name} exercise`,
        category: ex.category,
        imageUrl: ex.imageUrl
      }))
    );

    // Seed exercises
    for (const exercise of allExercises) {
      try {
        const docRef = exercisesRef.doc(exercise.id);
        const doc = await docRef.get();

        if (doc.exists && !force) {
          console.log(`⏭️  Skipped: ${exercise.name} (already exists)`);
          skipped++;
          continue;
        }

        await docRef.set({
          name: exercise.name,
          description: exercise.description,
          category: exercise.category,
          imageUrl: exercise.imageUrl
        }, { merge: true });

        console.log(`✅ Added: ${exercise.name} (${exercise.category})`);
        added++;
      } catch (error) {
        console.error(`❌ Error adding ${exercise.name}:`, error.message);
        errors++;
      }
    }

    console.log(`\n📊 Seeding Summary:`);
    console.log(`   ✅ Added: ${added}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📝 Total: ${allExercises.length}`);

    if (errors === 0) {
      console.log(`\n🎉 Successfully seeded exercises to ${env} environment!`);
      process.exit(0);
    } else {
      console.log(`\n⚠️  Completed with ${errors} error(s)`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run seeding
seedExercises();

