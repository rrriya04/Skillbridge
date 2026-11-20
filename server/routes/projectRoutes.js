const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
  getJoinedProjects,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// Specific routes before parameterized :id route
router.get('/my-projects', protect, getMyProjects);
router.get('/joined', protect, getJoinedProjects);

router.route('/')
  .get(getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
