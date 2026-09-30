const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { getDashboard } = require('../controllers/adminDashboardController');

const router = express.Router();

router.get('/dashboard', authMiddleware, authorizeRoles('admin'), getDashboard);

module.exports = router;