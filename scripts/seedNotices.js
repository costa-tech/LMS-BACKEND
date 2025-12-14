/**
 * Seed Notices/Announcements
 * Run this script with: npm run seed:notices
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

const notices = [
  {
    title: 'Welcome to NextGen LMS!',
    message: 'We are excited to have you join our learning platform. Start exploring our courses and enhance your skills today!',
    type: 'info',
    priority: 'high',
    isActive: true,
    expiryDate: new Date('2025-12-31'),
  },
  {
    title: 'New Courses Available',
    message: 'Check out our newly added courses in Web Development, Data Science, and Cloud Computing. Enroll now with special access keys!',
    type: 'announcement',
    priority: 'medium',
    isActive: true,
    expiryDate: new Date('2025-06-30'),
  },
  {
    title: 'Platform Update',
    message: 'We have improved the course content delivery system. You can now access your courses faster with better video quality.',
    type: 'update',
    priority: 'medium',
    isActive: true,
    expiryDate: new Date('2025-03-31'),
  },
  {
    title: 'Access Keys Information',
    message: 'Use your course access keys to unlock premium content. Contact support if you need assistance with your access key.',
    type: 'info',
    priority: 'low',
    isActive: true,
    expiryDate: null,
  },
  {
    title: 'Holiday Schedule',
    message: 'Please note that our support team will have limited availability during the holiday season. We appreciate your patience.',
    type: 'announcement',
    priority: 'high',
    isActive: true,
    expiryDate: new Date('2025-01-15'),
  },
];

async function seedNotices() {
  try {
    console.log('🌱 Starting notices seeding...\n');

    for (const noticeData of notices) {
      // Check if notice already exists
      const existingNotice = await db.collection('notices')
        .where('title', '==', noticeData.title)
        .get();

      if (!existingNotice.empty) {
        console.log(`⚠️  Notice "${noticeData.title}" already exists, skipping...`);
        continue;
      }

      // Create notice document
      const noticeDoc = {
        ...noticeData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection('notices').add(noticeDoc);
      console.log(`✅ Created notice: ${noticeData.title}`);
    }

    console.log('\n🎉 Notices seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding notices:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seedNotices();
