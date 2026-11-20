const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const CollaborationRequest = require('./models/CollaborationRequest');
const { sampleUsers, sampleProjects } = require('./utils/seedData');

// Load env vars
dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.log('⚠️  No MONGODB_URI found. Trying in-memory MongoDB for seeding...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
    } else {
      await mongoose.connect(mongoUri);
    }

    console.log('🌱 Connected to database for seeding...');

    // Clear existing data safely
    await User.deleteMany();
    await Project.deleteMany();
    await CollaborationRequest.deleteMany();

    console.log('🧹 Cleared existing database records.');

    // 1. Create Users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`👤 Created ${createdUsers.length} sample student users.`);

    // 2. Create Projects
    const createdProjects = [];
    for (const p of sampleProjects) {
      const creator = createdUsers[p.userIndex];
      const project = await Project.create({
        title: p.title,
        description: p.description,
        category: p.category,
        requiredSkills: p.requiredSkills,
        teamSize: p.teamSize,
        duration: p.duration,
        collaborationType: p.collaborationType,
        status: p.status,
        createdBy: creator._id,
        members: [
          {
            user: creator._id,
            role: 'Project Lead',
            joinedAt: new Date(),
          },
        ],
      });
      createdProjects.push(project);
    }
    console.log(`📁 Created ${createdProjects.length} sample college projects.`);

    // 3. Add a sample member and a sample collaboration request
    // Add Ananya to Aarav's Campus Lost & Found Portal
    const lostAndFoundProject = createdProjects.find(
      (p) => p.title.includes('Lost & Found')
    );
    if (lostAndFoundProject) {
      lostAndFoundProject.members.push({
        user: createdUsers[3]._id, // Ananya
        role: 'UI Designer',
        joinedAt: new Date(),
      });
      await lostAndFoundProject.save();

      // Create an Accepted request for historical record
      await CollaborationRequest.create({
        projectId: lostAndFoundProject._id,
        senderId: createdUsers[3]._id,
        receiverId: createdUsers[0]._id,
        message: 'Hi Aarav, I would love to design the UI and high-fidelity wireframes in Figma!',
        status: 'Accepted',
      });
    }

    // Create a pending request: Aarav wants to join Priya's Plant Disease project
    const plantDiseaseProject = createdProjects.find(
      (p) => p.title.includes('Plant Disease')
    );
    if (plantDiseaseProject) {
      await CollaborationRequest.create({
        projectId: plantDiseaseProject._id,
        senderId: createdUsers[0]._id, // Aarav
        receiverId: createdUsers[1]._id, // Priya
        message: 'Hi Priya! I have experience building React dashboards and connecting them to Flask AI backends.',
        status: 'Pending',
      });
    }

    console.log('🤝 Created sample collaboration requests and team memberships.');
    console.log('🎉 Seeding successfully completed!');
    console.log('----------------------------------------------------');
    console.log('Demo Credentials for Viva / Demo:');
    console.log('Email: aarav.sharma@college.edu    | Password: password123');
    console.log('Email: priya.patel@college.edu     | Password: password123');
    console.log('Email: rohan.verma@college.edu     | Password: password123');
    console.log('Email: ananya.iyer@college.edu     | Password: password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
