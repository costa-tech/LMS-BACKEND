/**
 * Seed Courses
 * Run this script with: npm run seed:courses
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

const courses = [
  {
    title: 'Web Design Basic to advance',
    description: 'Learn web design from the ground up with this comprehensive course. Master HTML, CSS, responsive design, and modern design principles. Perfect for aspiring web designers who want to build professional websites.',
    instructor: 'John Smith',
    duration: '12 weeks',
    level: 'Beginner to Advanced',
    price: '$99',
    image: '/image.png',
    rating: 5.0,
    students: 15420,
    category: 'Design',
    language: 'English',
    skills: ['HTML', 'CSS', 'Responsive Design', 'Design Tools', 'Typography'],
    curriculum: [
      'Introduction to Web Design',
      'HTML Fundamentals',
      'CSS Styling Techniques',
      'Responsive Design with Media Queries',
      'Design Tools and Software',
      'Color Theory and Typography',
      'Advanced CSS Layouts',
      'JavaScript for Designers',
      'Portfolio Development',
      'Freelancing Essentials'
    ],
    isActive: true,
  },
  {
    title: 'Web development Basic to advance',
    description: 'Become a full-stack web developer with this intensive course covering front-end and back-end technologies. Learn modern frameworks, databases, and deployment strategies.',
    instructor: 'Sarah Johnson',
    duration: '16 weeks',
    level: 'Beginner to Advanced',
    price: '$149',
    image: '/coding-on-laptop-with-dark-theme.jpg',
    rating: 5.0,
    students: 21340,
    category: 'Development',
    language: 'English',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'REST APIs'],
    curriculum: [
      'Programming Fundamentals',
      'HTML & CSS Foundation',
      'JavaScript Essentials',
      'Front-end Frameworks (React)',
      'Node.js & Express',
      'Database Design (MongoDB)',
      'API Development',
      'Version Control (Git)',
      'Testing & Debugging',
      'Deployment & DevOps'
    ],
    isActive: true,
  },
  {
    title: 'Digital marketing Basic to advance',
    description: 'Master digital marketing strategies to grow your business online. Learn SEO, social media marketing, content creation, analytics, and paid advertising.',
    instructor: 'Mike Davis',
    duration: '10 weeks',
    level: 'Beginner to Advanced',
    price: '$89',
    image: '/digital-marketing-dashboard-on-laptop.jpg',
    rating: 5.0,
    students: 18250,
    category: 'Marketing',
    language: 'English',
    skills: ['SEO', 'Social Media', 'Analytics', 'PPC', 'Content Marketing', 'Email Marketing'],
    curriculum: [
      'Digital Marketing Overview',
      'Search Engine Optimization (SEO)',
      'Content Marketing Strategy',
      'Social Media Marketing',
      'Email Marketing',
      'PPC Advertising (Google Ads)',
      'Analytics & Reporting',
      'Marketing Automation',
      'Conversion Optimization',
      'Case Studies & Projects'
    ],
    isActive: true,
  },
  {
    title: 'App Design Basic to advance',
    description: 'Learn mobile app design from concept to implementation. Master UI/UX principles, prototyping tools, and design systems for iOS and Android.',
    instructor: 'Emma Wilson',
    duration: '14 weeks',
    level: 'Beginner to Advanced',
    price: '$119',
    image: '/app-design-on-computer-screen.jpg',
    rating: 5.0,
    students: 12890,
    category: 'Design',
    language: 'English',
    skills: ['UI/UX Design', 'Prototyping', 'Wireframing', 'Design Systems', 'Mobile Design'],
    curriculum: [
      'Introduction to App Design',
      'User Research & Personas',
      'Information Architecture',
      'Wireframing & Prototyping',
      'Visual Design Principles',
      'iOS Design Guidelines',
      'Android Design Guidelines',
      'Micro-interactions',
      'Usability Testing',
      'Design Systems'
    ],
    isActive: true,
  },
  {
    title: 'Mobile design Basic to advance',
    description: 'Comprehensive mobile design course covering responsive design, touch interactions, and cross-platform development. Perfect for designers entering mobile UX.',
    instructor: 'Alex Chen',
    duration: '13 weeks',
    level: 'Beginner to Advanced',
    price: '$109',
    image: '/mobile-app-design-on-laptop.jpg',
    rating: 5.0,
    students: 15670,
    category: 'Design',
    language: 'English',
    skills: ['Mobile UX', 'Responsive Design', 'Touch Design', 'Accessibility', 'Cross-platform'],
    curriculum: [
      'Mobile Design Fundamentals',
      'Responsive Design Patterns',
      'Touch Gestures & Interactions',
      'Cross-Platform Design',
      'Mobile UI Components',
      'Navigation Patterns',
      'Accessibility in Mobile',
      'Performance Considerations',
      'Testing & Iteration',
      'Portfolio Projects'
    ],
    isActive: true,
  },
  {
    title: 'Graphics Design Basic to advance',
    description: 'Master graphic design with industry-standard tools and techniques. Learn Adobe Creative Suite, branding, print design, and digital graphics.',
    instructor: 'Lisa Rodriguez',
    duration: '15 weeks',
    level: 'Beginner to Advanced',
    price: '$129',
    image: '/graphic-design-workspace-on-laptop.jpg',
    rating: 5.0,
    students: 19430,
    category: 'Design',
    language: 'English',
    skills: ['Photoshop', 'Illustrator', 'InDesign', 'Typography', 'Branding'],
    curriculum: [
      'Design Principles & Theory',
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Adobe InDesign',
      'Typography & Layout',
      'Color Theory',
      'Branding & Identity',
      'Print Design',
      'Digital Graphics',
      'Portfolio Development'
    ],
    isActive: true,
  },
  {
    title: 'Python Programming Basic to advance',
    description: 'Learn Python programming from basics to advanced concepts. Perfect for beginners and those looking to enhance their programming skills.',
    instructor: 'David Kumar',
    duration: '12 weeks',
    level: 'Beginner to Advanced',
    price: '$139',
    image: '/images/Rectangle 1080.png',
    rating: 5.0,
    students: 22150,
    category: 'Programming',
    language: 'English',
    skills: ['Python', 'OOP', 'Data Structures', 'Algorithms', 'Problem Solving'],
    curriculum: [
      'Python Basics',
      'Variables and Data Types',
      'Control Flow',
      'Functions and Modules',
      'Object-Oriented Programming',
      'File Handling',
      'Error Handling',
      'Libraries and Frameworks',
      'Project Development',
      'Best Practices'
    ],
    isActive: true,
  },
  {
    title: 'Data Science Fundamentals',
    description: 'Master data science with Python, pandas, and machine learning. Learn to analyze data, create visualizations, and build predictive models.',
    instructor: 'Emma Thompson',
    duration: '16 weeks',
    level: 'Intermediate',
    price: '$159',
    image: '/data-science-charts-laptop.jpg',
    rating: 5.0,
    students: 17890,
    category: 'Data Science',
    language: 'English',
    skills: ['Python', 'Pandas', 'NumPy', 'Data Visualization', 'Machine Learning', 'Statistics'],
    curriculum: [
      'Introduction to Data Science',
      'Python for Data Science',
      'Data Cleaning and Preprocessing',
      'Exploratory Data Analysis',
      'Data Visualization',
      'Statistical Analysis',
      'Machine Learning Basics',
      'Supervised Learning',
      'Unsupervised Learning',
      'Real-world Projects'
    ],
    isActive: true,
  },
  {
    title: 'UI/UX Design Masterclass',
    description: 'Learn user interface and user experience design principles. Create beautiful, functional designs that users love.',
    instructor: 'Michael Chen',
    duration: '10 weeks',
    level: 'Beginner to Advanced',
    price: '$119',
    image: '/uiux-design-mockups.jpg',
    rating: 5.0,
    students: 16780,
    category: 'Design',
    language: 'English',
    skills: ['UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'User Testing', 'Figma'],
    curriculum: [
      'Introduction to UI/UX',
      'Design Thinking Process',
      'User Research Methods',
      'Creating User Personas',
      'Information Architecture',
      'Wireframing',
      'Visual Design',
      'Prototyping',
      'Usability Testing',
      'Design Systems'
    ],
    isActive: true,
  },
  {
    title: 'Full Stack Development',
    description: 'Become a full-stack developer with modern technologies. Build complete web applications from front-end to back-end.',
    instructor: 'Sarah Williams',
    duration: '20 weeks',
    level: 'Advanced',
    price: '$199',
    image: '/fullstack-code-editor.jpg',
    rating: 5.0,
    students: 14560,
    category: 'Development',
    language: 'English',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Authentication', 'Deployment'],
    curriculum: [
      'Web Development Fundamentals',
      'Advanced JavaScript',
      'React and State Management',
      'Node.js and Express',
      'Database Design',
      'RESTful API Development',
      'Authentication & Security',
      'Testing',
      'DevOps and Deployment',
      'Capstone Project'
    ],
    isActive: true,
  },
  {
    title: 'Cloud Computing with AWS',
    description: 'Master Amazon Web Services and cloud architecture. Learn to design, deploy, and manage scalable cloud solutions.',
    instructor: 'Robert Martinez',
    duration: '14 weeks',
    level: 'Intermediate to Advanced',
    price: '$179',
    image: '/aws-cloud-architecture.jpg',
    rating: 5.0,
    students: 13240,
    category: 'Cloud Computing',
    language: 'English',
    skills: ['AWS', 'EC2', 'S3', 'Lambda', 'CloudFormation', 'DevOps', 'Security'],
    curriculum: [
      'Introduction to Cloud Computing',
      'AWS Fundamentals',
      'EC2 and Compute Services',
      'Storage Services (S3, EBS)',
      'Networking and VPC',
      'Database Services',
      'Serverless with Lambda',
      'Security and IAM',
      'Monitoring and Logging',
      'AWS Certification Prep'
    ],
    isActive: true,
  },
  {
    title: 'Machine Learning Basics',
    description: 'Introduction to machine learning algorithms and applications. Build intelligent systems that learn from data.',
    instructor: 'Emily Johnson',
    duration: '16 weeks',
    level: 'Intermediate',
    price: '$169',
    image: '/machine-learning-neural-network.jpg',
    rating: 5.0,
    students: 15890,
    category: 'Machine Learning',
    language: 'English',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Neural Networks', 'Deep Learning', 'AI'],
    curriculum: [
      'Introduction to Machine Learning',
      'Python for ML',
      'Supervised Learning',
      'Unsupervised Learning',
      'Neural Networks',
      'Deep Learning',
      'Computer Vision',
      'Natural Language Processing',
      'Model Deployment',
      'ML Projects'
    ],
    isActive: true,
  },
];

async function seedCourses() {
  try {
    console.log('🌱 Starting courses seeding...\n');

    for (const courseData of courses) {
      // Check if course already exists
      const existingCourse = await db.collection('courses')
        .where('title', '==', courseData.title)
        .get();

      if (!existingCourse.empty) {
        console.log(`⚠️  Course "${courseData.title}" already exists, skipping...`);
        continue;
      }

      // Create course document
      const courseDoc = {
        ...courseData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await db.collection('courses').add(courseDoc);
      console.log(`✅ Created course: ${courseData.title} (ID: ${docRef.id})`);
    }

    console.log('\n🎉 Courses seeding completed successfully!');
    console.log(`\n📊 Total courses created: ${courses.length}`);

  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seedCourses();
