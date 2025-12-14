/**
 * Seed Course Content for all 12 courses
 * Run this script with: npm run seed:content
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

const courseContents = [
  {
    courseId: '1',
    title: 'Web Design Basic to Advance',
    sections: [
      {
        sectionTitle: 'Introduction to Web Design',
        lessons: [
          { title: 'What is Web Design?', type: 'video', duration: '15 min', description: 'Overview of web design principles', url: 'https://example.com/video1' },
          { title: 'Design Tools Overview', type: 'video', duration: '20 min', description: 'Introduction to popular design tools', url: 'https://example.com/video2' },
          { title: 'Course Materials', type: 'document', description: 'Download course syllabus and resources', content: 'Course syllabus and introduction materials' },
        ]
      },
      {
        sectionTitle: 'HTML & CSS Fundamentals',
        lessons: [
          { title: 'HTML Basics', type: 'video', duration: '30 min', description: 'Learn HTML structure and tags', url: 'https://example.com/video3' },
          { title: 'CSS Styling', type: 'video', duration: '35 min', description: 'Master CSS styling techniques', url: 'https://example.com/video4' },
          { title: 'Practice Files', type: 'download', description: 'Download HTML & CSS practice files', url: 'https://example.com/files1' },
        ]
      }
    ]
  },
  {
    courseId: '2',
    title: 'Web Development Basic to Advance',
    sections: [
      {
        sectionTitle: 'Programming Fundamentals',
        lessons: [
          { title: 'Introduction to Programming', type: 'video', duration: '25 min', description: 'Programming concepts and logic', url: 'https://example.com/video5' },
          { title: 'JavaScript Basics', type: 'video', duration: '40 min', description: 'Learn JavaScript fundamentals', url: 'https://example.com/video6' },
        ]
      },
      {
        sectionTitle: 'React Framework',
        lessons: [
          { title: 'React Components', type: 'video', duration: '45 min', description: 'Building React components', url: 'https://example.com/video7' },
          { title: 'State Management', type: 'video', duration: '50 min', description: 'Managing state in React', url: 'https://example.com/video8' },
        ]
      }
    ]
  },
  {
    courseId: '3',
    title: 'Digital Marketing Basic to Advance',
    sections: [
      {
        sectionTitle: 'Digital Marketing Basics',
        lessons: [
          { title: 'What is Digital Marketing?', type: 'video', duration: '20 min', description: 'Overview of digital marketing', url: 'https://example.com/video9' },
          { title: 'Marketing Channels', type: 'video', duration: '30 min', description: 'Different digital marketing channels', url: 'https://example.com/video10' },
        ]
      },
      {
        sectionTitle: 'SEO Fundamentals',
        lessons: [
          { title: 'Search Engine Optimization', type: 'video', duration: '35 min', description: 'Learn SEO basics', url: 'https://example.com/video11' },
          { title: 'Keyword Research', type: 'video', duration: '25 min', description: 'Finding the right keywords', url: 'https://example.com/video12' },
        ]
      }
    ]
  },
  {
    courseId: '4',
    title: 'App Design Basic to Advance',
    sections: [
      {
        sectionTitle: 'Mobile App Design Basics',
        lessons: [
          { title: 'Introduction to App Design', type: 'video', duration: '20 min', description: 'Mobile design principles', url: 'https://example.com/video13' },
          { title: 'User Interface Design', type: 'video', duration: '30 min', description: 'Creating beautiful interfaces', url: 'https://example.com/video14' },
        ]
      }
    ]
  },
  {
    courseId: '5',
    title: 'Mobile Design Basic to Advance',
    sections: [
      {
        sectionTitle: 'Responsive Design',
        lessons: [
          { title: 'Mobile-First Design', type: 'video', duration: '25 min', description: 'Designing for mobile devices', url: 'https://example.com/video15' },
          { title: 'Touch Interactions', type: 'video', duration: '20 min', description: 'Designing touch interactions', url: 'https://example.com/video16' },
        ]
      }
    ]
  },
  {
    courseId: '6',
    title: 'Graphics Design Basic to Advance',
    sections: [
      {
        sectionTitle: 'Design Fundamentals',
        lessons: [
          { title: 'Color Theory', type: 'video', duration: '30 min', description: 'Understanding colors in design', url: 'https://example.com/video17' },
          { title: 'Typography', type: 'video', duration: '25 min', description: 'Font selection and usage', url: 'https://example.com/video18' },
        ]
      },
      {
        sectionTitle: 'Adobe Tools',
        lessons: [
          { title: 'Photoshop Basics', type: 'video', duration: '40 min', description: 'Introduction to Photoshop', url: 'https://example.com/video19' },
          { title: 'Illustrator Essentials', type: 'video', duration: '35 min', description: 'Vector graphics with Illustrator', url: 'https://example.com/video20' },
        ]
      }
    ]
  },
  {
    courseId: '7',
    title: 'Python Programming Basic to Advance',
    sections: [
      {
        sectionTitle: 'Python Basics',
        lessons: [
          { title: 'Introduction to Python', type: 'video', duration: '30 min', description: 'Python fundamentals', url: 'https://example.com/video21' },
          { title: 'Variables and Data Types', type: 'video', duration: '25 min', description: 'Working with data in Python', url: 'https://example.com/video22' },
        ]
      },
      {
        sectionTitle: 'Advanced Python',
        lessons: [
          { title: 'Object-Oriented Programming', type: 'video', duration: '45 min', description: 'OOP concepts in Python', url: 'https://example.com/video23' },
          { title: 'File Handling', type: 'video', duration: '30 min', description: 'Reading and writing files', url: 'https://example.com/video24' },
        ]
      }
    ]
  },
  {
    courseId: '8',
    title: 'Data Science Fundamentals',
    sections: [
      {
        sectionTitle: 'Data Science Introduction',
        lessons: [
          { title: 'What is Data Science?', type: 'video', duration: '20 min', description: 'Overview of data science', url: 'https://example.com/video25' },
          { title: 'Data Analysis Tools', type: 'video', duration: '30 min', description: 'Tools for data analysis', url: 'https://example.com/video26' },
        ]
      },
      {
        sectionTitle: 'Machine Learning Basics',
        lessons: [
          { title: 'Introduction to ML', type: 'video', duration: '35 min', description: 'Machine learning concepts', url: 'https://example.com/video27' },
          { title: 'ML Algorithms', type: 'video', duration: '40 min', description: 'Common ML algorithms', url: 'https://example.com/video28' },
        ]
      }
    ]
  },
  {
    courseId: '9',
    title: 'UI/UX Design Masterclass',
    sections: [
      {
        sectionTitle: 'UX Research',
        lessons: [
          { title: 'User Research Methods', type: 'video', duration: '30 min', description: 'Conducting user research', url: 'https://example.com/video29' },
          { title: 'Creating User Personas', type: 'video', duration: '25 min', description: 'Developing user personas', url: 'https://example.com/video30' },
        ]
      },
      {
        sectionTitle: 'UI Design',
        lessons: [
          { title: 'Visual Hierarchy', type: 'video', duration: '35 min', description: 'Creating visual hierarchy', url: 'https://example.com/video31' },
          { title: 'Design Systems', type: 'video', duration: '40 min', description: 'Building design systems', url: 'https://example.com/video32' },
        ]
      }
    ]
  },
  {
    courseId: '10',
    title: 'Full Stack Development',
    sections: [
      {
        sectionTitle: 'Frontend Development',
        lessons: [
          { title: 'Modern JavaScript', type: 'video', duration: '45 min', description: 'ES6+ features', url: 'https://example.com/video33' },
          { title: 'React Advanced', type: 'video', duration: '50 min', description: 'Advanced React patterns', url: 'https://example.com/video34' },
        ]
      },
      {
        sectionTitle: 'Backend Development',
        lessons: [
          { title: 'Node.js & Express', type: 'video', duration: '55 min', description: 'Building REST APIs', url: 'https://example.com/video35' },
          { title: 'Database Design', type: 'video', duration: '40 min', description: 'Working with databases', url: 'https://example.com/video36' },
        ]
      }
    ]
  },
  {
    courseId: '11',
    title: 'Cloud Computing with AWS',
    sections: [
      {
        sectionTitle: 'AWS Basics',
        lessons: [
          { title: 'Introduction to AWS', type: 'video', duration: '25 min', description: 'AWS fundamentals', url: 'https://example.com/video37' },
          { title: 'EC2 Instances', type: 'video', duration: '30 min', description: 'Working with EC2', url: 'https://example.com/video38' },
        ]
      },
      {
        sectionTitle: 'Cloud Architecture',
        lessons: [
          { title: 'Designing Cloud Solutions', type: 'video', duration: '40 min', description: 'Cloud architecture patterns', url: 'https://example.com/video39' },
          { title: 'AWS Services Overview', type: 'video', duration: '35 min', description: 'Key AWS services', url: 'https://example.com/video40' },
        ]
      }
    ]
  },
  {
    courseId: '12',
    title: 'Machine Learning Basics',
    sections: [
      {
        sectionTitle: 'ML Fundamentals',
        lessons: [
          { title: 'Introduction to Machine Learning', type: 'video', duration: '30 min', description: 'ML concepts and applications', url: 'https://example.com/video41' },
          { title: 'Supervised Learning', type: 'video', duration: '35 min', description: 'Classification and regression', url: 'https://example.com/video42' },
        ]
      },
      {
        sectionTitle: 'Deep Learning',
        lessons: [
          { title: 'Neural Networks', type: 'video', duration: '40 min', description: 'Introduction to neural networks', url: 'https://example.com/video43' },
          { title: 'TensorFlow Basics', type: 'video', duration: '45 min', description: 'Building models with TensorFlow', url: 'https://example.com/video44' },
        ]
      }
    ]
  }
];

async function seedCourseContent() {
  try {
    console.log('🌱 Starting course content seeding...\n');

    for (const content of courseContents) {
      // Check if content already exists
      const existingContent = await db.collection('courseContent')
        .where('courseId', '==', content.courseId)
        .get();

      if (!existingContent.empty) {
        console.log(`⚠️  Content for Course ID ${content.courseId} already exists, skipping...`);
        continue;
      }

      // Create course content document
      const contentDoc = {
        ...content,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection('courseContent').add(contentDoc);
      console.log(`✅ Created content for: ${content.title}`);
    }

    console.log('\n🎉 Course content seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding course content:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seedCourseContent();
