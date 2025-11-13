/**
 * Firebase Configuration
 * Sets up Firebase Admin SDK for backend operations
 */

import admin from 'firebase-admin';
import dotenv from 'dotenv';
import logger from '../src/utils/logger.js';

dotenv.config();

let db = null;

/**
 * Initialize Firebase Admin SDK
 */
export const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      logger.info('Firebase already initialized');
      db = admin.firestore();
      return;
    }

    // Option 1: Load from service account JSON file (recommended for development)
    // Uncomment this to use the service account JSON file:
    // import serviceAccount from './nextg-lms-service.json' assert { type: 'json' };
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount),
    //   databaseURL: process.env.FIREBASE_DATABASE_URL,
    // });

    // Option 2: Load from environment variables (recommended for production)
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    // Get Firestore instance
    db = admin.firestore();

    logger.info('✅ Firebase initialized successfully');
    logger.info(`📦 Project: ${process.env.FIREBASE_PROJECT_ID}`);
  } catch (error) {
    logger.error('❌ Firebase initialization failed:', error);
    throw error;
  }
};

/**
 * Get Firestore database instance
 */
export const getFirestore = () => {
  if (!db) {
    throw new Error('Firestore not initialized. Call initializeFirebase() first.');
  }
  return db;
};

/**
 * Get Firebase Admin instance
 */
export const getAdmin = () => admin;

export default { initializeFirebase, getFirestore, getAdmin };
