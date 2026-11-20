/**
 * Realistic sample data for college demonstration and viva
 */
const sampleUsers = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    password: 'password123',
    college: 'National Institute of Technology',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    bio: 'Full-stack enthusiast and AI explorer. Love building clean web apps and solving real campus challenges.',
    skills: ['React', 'Node.js', 'MongoDB', 'Python', 'Tailwind CSS', 'Git'],
    interests: ['Web Development', 'Machine Learning', 'Hackathons'],
    github: 'https://github.com/aarav-sharma-demo',
    linkedin: 'https://linkedin.com/in/aarav-sharma-demo',
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@college.edu',
    password: 'password123',
    college: 'College of Engineering & Technology',
    department: 'Information Technology',
    year: '4th Year',
    bio: 'Aspiring Data Scientist and ML researcher. Focused on computer vision and healthcare analytics.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'Pandas', 'Flask'],
    interests: ['AI / Machine Learning', 'Computer Vision', 'Deep Learning'],
    github: 'https://github.com/priya-patel-ml',
    linkedin: 'https://linkedin.com/in/priya-patel-ml',
  },
  {
    name: 'Rohan Verma',
    email: 'rohan.verma@college.edu',
    password: 'password123',
    college: 'Apex Institute of Technology',
    department: 'Electronics & Communication',
    year: '2nd Year',
    bio: 'IoT hardware developer & Flutter enthusiast. Building connected gadgets and smart sensor nodes.',
    skills: ['Flutter', 'Dart', 'Arduino', 'Raspberry Pi', 'C++', 'Firebase'],
    interests: ['App Development', 'IoT', 'Embedded Systems'],
    github: 'https://github.com/rohan-verma-iot',
    linkedin: 'https://linkedin.com/in/rohan-verma-iot',
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@college.edu',
    password: 'password123',
    college: 'Metropolitan Engineering College',
    department: 'Computer Science',
    year: '3rd Year',
    bio: 'UI/UX Designer who codes. Believer in accessible interfaces, sleek micro-interactions, and human-centric design.',
    skills: ['Figma', 'UI/UX Design', 'React', 'CSS', 'User Research', 'Prototyping'],
    interests: ['Design', 'Frontend Development', 'Product Design'],
    github: 'https://github.com/ananya-designs',
    linkedin: 'https://linkedin.com/in/ananya-iyer-design',
  },
];

const sampleProjects = [
  {
    title: 'AI-Based Plant Disease Detection System',
    description:
      'A deep learning computer vision mobile & web application to detect crop leaf diseases using convolutional neural networks (CNNs). Farmers upload a photo of the affected plant leaf, and the model instantly predicts the pathology and provides organic treatment suggestions.',
    category: 'AI / Machine Learning',
    requiredSkills: ['Python', 'TensorFlow', 'Flask', 'React', 'Computer Vision'],
    teamSize: 4,
    duration: '2-3 months',
    collaborationType: 'Hybrid',
    status: 'Looking for Team Members',
    userIndex: 1, // Priya Patel
  },
  {
    title: 'Campus Lost & Found Portal with Smart Matching',
    description:
      'A centralized college platform where students and faculty can post lost or found items (ID cards, earphones, books, keys). Uses intelligent keyword and image comparison to alert owners when a potential match is reported on campus.',
    category: 'Web Development',
    requiredSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    teamSize: 3,
    duration: '1-2 months',
    collaborationType: 'Online',
    status: 'Looking for Team Members',
    userIndex: 0, // Aarav Sharma
  },
  {
    title: 'Smart Student Expense & Split Tracker',
    description:
      'A lightweight expense tracking mobile-responsive app tailored for hostel students and college roommates. Automatically calculates shared grocery, canteen, and mess bills, generates monthly spending analytics, and reminds members of pending dues.',
    category: 'App Development',
    requiredSkills: ['React', 'Node.js', 'Chart.js', 'MongoDB', 'Express'],
    teamSize: 3,
    duration: '1-2 months',
    collaborationType: 'Online',
    status: 'In Progress',
    userIndex: 2, // Rohan Verma
  },
  {
    title: 'Online Academic Book & Note Exchange',
    description:
      'A peer-to-peer campus book swap platform where seniors can donate, sell at a discount, or lend textbooks, lab manuals, and handwritten lecture notes to juniors, saving paper and reducing student expenditure.',
    category: 'Web Development',
    requiredSkills: ['React', 'JavaScript', 'CSS', 'Node.js', 'MongoDB'],
    teamSize: 4,
    duration: '2-3 months',
    collaborationType: 'Offline',
    status: 'Looking for Team Members',
    userIndex: 3, // Ananya Iyer
  },
  {
    title: 'Smart Road Pothole Detection & Civic Mapping',
    description:
      'An IoT accelerometer and GPS-equipped mobile solution that automatically logs road vibrations, identifies dangerous potholes while driving or cycling, and plots a severity heat map for municipal repair authorities.',
    category: 'IoT',
    requiredSkills: ['IoT', 'Arduino', 'Python', 'React', 'Google Maps API'],
    teamSize: 4,
    duration: '3-4 months',
    collaborationType: 'Hybrid',
    status: 'Looking for Team Members',
    userIndex: 2, // Rohan Verma
  },
  {
    title: 'Student Event & Hackathon Management Portal',
    description:
      'A collaborative portal for college clubs and student chapters to publish workshops, technical symposiums, and hackathons. Features online ticket booking, QR check-in, and team formation leaderboards.',
    category: 'Web Development',
    requiredSkills: ['React', 'Express', 'MongoDB', 'REST API', 'Figma'],
    teamSize: 3,
    duration: '1-2 months',
    collaborationType: 'Online',
    status: 'Team Complete',
    userIndex: 0, // Aarav Sharma
  },
];

module.exports = {
  sampleUsers,
  sampleProjects,
};
