const { getAdminDashboardData } = require('../data/adminDashboardMock');

async function getDashboard(req, res) {
  try {
    const dashboard = await getAdminDashboardData();
    return res.status(200).json(dashboard);
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return res.status(500).json({ message: 'Unable to load dashboard data.' });
  }
}

module.exports = { getDashboard };