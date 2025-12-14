/**
 * Complete Database Setup Script
 * This script will seed all data in the correct order
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const steps = [
  { name: 'Users (Admin & Students)', command: 'npm run seed:users' },
  { name: 'Courses (12 courses)', command: 'npm run seed:courses' },
  { name: 'Access Keys', command: 'npm run seed:keys' },
  { name: 'Course Content', command: 'npm run seed:content' },
  { name: 'Notices', command: 'npm run seed:notices' },
];

async function setupDatabase() {
  console.log('🚀 Starting complete database setup...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    console.log(`📦 Step ${i + 1}/${steps.length}: Seeding ${step.name}...`);
    
    try {
      const { stdout, stderr } = await execAsync(step.command);
      
      if (stderr && !stderr.includes('ExperimentalWarning')) {
        console.error(`⚠️  Warning: ${stderr}`);
      }
      
      console.log(stdout);
      console.log(`✅ ${step.name} completed!\n`);
    } catch (error) {
      console.error(`❌ Error seeding ${step.name}:`, error.message);
      console.log('\n⚠️  Continuing with next step...\n');
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 Database setup completed!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('📋 Quick Reference:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin Login:');
  console.log('  Email: admin@nextgenacademy.com');
  console.log('  Password: admin123');
  console.log('');
  console.log('Student Login:');
  console.log('  Email: john@example.com');
  console.log('  Password: student123');
  console.log('');
  console.log('Sample Access Key:');
  console.log('  WEBDESIGN-2024-A1B2 (for Course 1)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('Next steps:');
  console.log('1. Start the backend: npm run dev');
  console.log('2. Start the frontend: cd ../nextgen-lms && npm run dev');
  console.log('3. Login and test the application!\n');
}

setupDatabase().catch(console.error);
