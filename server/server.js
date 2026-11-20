const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const requestRoutes = require('./routes/requestRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(async () => {
  // If running in zero-config in-memory mode and database is empty, seed initial demo data
  if (!process.env.MONGODB_URI) {
    try {
      const Project = require('./models/Project');
      const User = require('./models/User');
      const CollaborationRequest = require('./models/CollaborationRequest');
      const count = await Project.countDocuments();
      if (count === 0) {
        console.log('🌱 Populating initial demo data in in-memory database for viva demo...');
        const { sampleUsers, sampleProjects } = require('./utils/seedData');
        const createdUsers = [];
        for (const u of sampleUsers) {
          const user = await User.create(u);
          createdUsers.push(user);
        }
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
        // Add sample collaboration request & member
        const lostAndFoundProject = createdProjects.find((p) => p.title.includes('Lost & Found'));
        if (lostAndFoundProject) {
          lostAndFoundProject.members.push({
            user: createdUsers[3]._id,
            role: 'UI Designer',
            joinedAt: new Date(),
          });
          await lostAndFoundProject.save();
          await CollaborationRequest.create({
            projectId: lostAndFoundProject._id,
            senderId: createdUsers[3]._id,
            receiverId: createdUsers[0]._id,
            message: 'Hi Aarav, I would love to design the UI and high-fidelity wireframes in Figma!',
            status: 'Accepted',
          });
        }
        const plantDiseaseProject = createdProjects.find((p) => p.title.includes('Plant Disease'));
        if (plantDiseaseProject) {
          await CollaborationRequest.create({
            projectId: plantDiseaseProject._id,
            senderId: createdUsers[0]._id,
            receiverId: createdUsers[1]._id,
            message: 'Hi Priya! I have experience building React dashboards and connecting them to Flask AI backends.',
            status: 'Pending',
          });
        }
        console.log('✅ Demo database seeded with sample projects, students, and requests!');
      }
    } catch (seedErr) {
      console.warn('Initial seed error:', seedErr.message);
    }
  }
});

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json());

// Request logger in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check and root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 SkillBridge API is running smoothly!',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      projects: '/api/projects',
      requests: '/api/requests',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/requests', requestRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 SkillBridge Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`📚 API Health: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Keep server running or gracefully close
});

module.exports = app;
