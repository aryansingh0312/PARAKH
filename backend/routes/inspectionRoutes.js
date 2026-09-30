const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  getEligibility,
  createRandomInspection,
  listInspections,
  getInspection,
  updateInspectionStatus,
} = require('../controllers/inspectionController');

const router = express.Router();
const monitoringRoles = [authMiddleware, authorizeRoles('admin', 'pmu', 'inspector')];
const assignmentRoles = [authMiddleware, authorizeRoles('admin', 'pmu')];

router.get('/eligibility', ...assignmentRoles, getEligibility);
router.post('/random', ...assignmentRoles, createRandomInspection);
router.get('/', ...monitoringRoles, listInspections);
router.get('/:id', ...monitoringRoles, getInspection);
router.patch('/:id/status', ...monitoringRoles, updateInspectionStatus);

module.exports = router;