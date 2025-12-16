/**
 * Seed Users (Admin and Test Users)
 * Run this script with: npm run seed:users
 */

import admin from 'firebase-admin';
import bcrypt from 'bcryptjs';
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

const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    name: 'Admin User',
    email: 'admin@nextgenacademy.com',
    password: 'admin123',
    role: 'admin',
    profileImage: '',
    bio: 'System Administrator',
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'student123',
    role: 'student',
    profileImage: '',
    bio: 'Passionate learner interested in web development and design',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'student123',
    role: 'student',
    profileImage: '',
    bio: 'Aspiring data scientist and machine learning enthusiast',
  },
];

async function seedUsers() {
  try {
    console.log('🌱 Starting user seeding...\n');

    for (const userData of users) {
      // Check if user already exists
      const existingUser = await db.collection('users')
        .where('email', '==', userData.email)
        .get();

      if (!existingUser.empty) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user document
      const userDoc = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        profileImage: userData.profileImage,
        bio: userData.bio,
        cart: [], // Shopping cart items
        enrolledCourses: [], // Course IDs user has access to
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection('users').add(userDoc);
      console.log(`✅ Created ${userData.role}: ${userData.email} (password: ${userData.password})`);
    }

    console.log('\n🎉 User seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    users.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seedUsers();
