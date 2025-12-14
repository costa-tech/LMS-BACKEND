/**
 * Update Access Keys with Actual Database Course IDs
 * This script fetches real course IDs from database and updates/creates access keys
 * Run this script with: npm run update:keys
 */

import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

// Initialize Firebase Admin
const serviceAccountPath = join(__dirname, '../config/nextg-lms-service.json');

try {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase:', error.message);
  process.exit(1);
}

const db = admin.firestore();

// Access key patterns with course titles for matching
const keyPatterns = [
  { key: 'WEBDESIGN-2024-A1B2', titleMatch: 'Web Design' },
  { key: 'WEBDEV-2024-C3D4', titleMatch: 'Web development' },
  { key: 'DIGITAL-2024-E5F6', titleMatch: 'Digital marketing' },
  { key: 'APPDESIGN-2024-G7H8', titleMatch: 'App Design' },
  { key: 'MOBILE-2024-I9J0', titleMatch: 'Mobile design' },
  { key: 'GRAPHICS-2024-K1L2', titleMatch: 'Graphics Design' },
  { key: 'PYTHON-2024-M3N4', titleMatch: 'Python Programming' },
  { key: 'DATASCIENCE-2024-O5P6', titleMatch: 'Data Science' },
  { key: 'UIUX-2024-Q7R8', titleMatch: 'UI/UX Design' },
  { key: 'FULLSTACK-2024-S9T0', titleMatch: 'Full Stack' },
  { key: 'AWS-2024-U1V2', titleMatch: 'Cloud Computing' },
  { key: 'ML-2024-W3X4', titleMatch: 'Machine Learning' }
];

async function updateAccessKeys() {
  try {
    console.log('🔍 Fetching courses from database...\n');

    // Fetch all courses from database
    const coursesSnapshot = await db.collection('courses').get();
    const courses = [];
    
    coursesSnapshot.forEach(doc => {
      courses.push({
        id: doc.id,
        title: doc.data().title
      });
    });

    console.log(`Found ${courses.length} courses in database\n`);

    // Delete old access keys (with numeric courseIds)
    console.log('🗑️  Deleting old access keys...');
    const oldKeysSnapshot = await db.collection('accessKeys').get();
    const batch = db.batch();
    oldKeysSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`✅ Deleted ${oldKeysSnapshot.size} old access keys\n`);

    console.log('🔑 Creating new access keys with database course IDs...\n');

    const createdKeys = [];
    
    for (const pattern of keyPatterns) {
      // Find matching course by title
      const matchingCourse = courses.find(c => 
        c.title.toLowerCase().includes(pattern.titleMatch.toLowerCase())
      );

      if (matchingCourse) {
        const keyData = {
          key: pattern.key,
          courseId: matchingCourse.id, // Use actual database ID
          expiryDate: '2025-12-31',
          maxUses: 100,
          currentUses: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await db.collection('accessKeys').add(keyData);
        createdKeys.push({
          key: pattern.key,
          courseId: matchingCourse.id,
          courseTitle: matchingCourse.title
        });
        console.log(`✅ Created key: ${pattern.key} for course "${matchingCourse.title}" (ID: ${matchingCourse.id})`);
      } else {
        console.log(`⚠️  No course found matching "${pattern.titleMatch}"`);
      }
    }

    // Also create keys for fallback courses (IDs 1-12)
    console.log('\n🔑 Creating access keys for fallback courses (1-12)...\n');

    for (let i = 1; i <= 12; i++) {
      const pattern = keyPatterns[i - 1];
      if (pattern) {
        // Check if key already exists
        const existing = createdKeys.find(k => k.key === pattern.key);
        if (!existing) {
          const fallbackKeyData = {
            key: pattern.key,
            courseId: String(i), // Fallback course ID
            expiryDate: '2025-12-31',
            maxUses: 100,
            currentUses: 0,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          await db.collection('accessKeys').add(fallbackKeyData);
          console.log(`✅ Created fallback key: ${pattern.key} for Course ID: ${i}`);
        }
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Access keys update completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📋 Updated Access Keys:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    createdKeys.forEach((k, idx) => {
      console.log(`${idx + 1}. ${k.key}`);
      console.log(`   Course: ${k.courseTitle}`);
      console.log(`   ID: ${k.courseId}\n`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating access keys:', error);
    process.exit(1);
  }
}

updateAccessKeys();
