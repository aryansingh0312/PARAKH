const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  listProjects,
  getProject,
  createProject,
  updateProject,
  updateProjectStatus,
  deleteProject,
} = require('../controllers/projectController');

const router = express.Router();
const adminOnly = [authMiddleware, authorizeRoles('admin')];
const monitoringRoles = [authMiddleware, authorizeRoles('admin', 'inspector', 'pmu', 'ngo')];

router.get('/', monitoringRoles, listProjects);
router.get('/:id', monitoringRoles, getProject);
router.post('/', ...adminOnly, createProject);
router.put('/:id', ...adminOnly, updateProject);
router.patch('/:id/status', ...adminOnly, updateProjectStatus);
router.delete('/:id', ...adminOnly, deleteProject);

module.exports = router;