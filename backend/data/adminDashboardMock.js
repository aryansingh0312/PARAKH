const dashboardData = {
  stats: {
    totalProjects: 124,
    totalNgos: 38,
    pendingInspections: 18,
    completedInspections: 106,
    highRiskProjects: 12,
  },
  statChanges: {
    totalProjects: '+8.2%',
    pendingInspections: '5 due today',
    completedInspections: '+12 this week',
    highRiskProjects: '3 new',
  },
  inspectionActivity: [
    { day: 'Mon', completed: 12 },
    { day: 'Tue', completed: 18 },
    { day: 'Wed', completed: 14 },
    { day: 'Thu', completed: 22 },
    { day: 'Fri', completed: 17 },
    { day: 'Sat', completed: 25 },
    { day: 'Sun', completed: 20 },
  ],
  riskDistribution: { low: 78, medium: 34, high: 12 },
  projectLocations: [
    { id: 'loc-1', name: 'ABC Skill Development Centre', region: 'North district', risk: 'low', x: 22, y: 30 },
    { id: 'loc-2', name: 'XYZ Welfare Centre', region: 'Central district', risk: 'medium', x: 48, y: 48 },
    { id: 'loc-3', name: 'Community Support Centre', region: 'East district', risk: 'high', x: 76, y: 27 },
    { id: 'loc-4', name: 'Rural Health Unit', region: 'South district', risk: 'low', x: 34, y: 72 },
    { id: 'loc-5', name: 'MGNREGA Cluster', region: 'West district', risk: 'medium', x: 68, y: 73 },
    { id: 'loc-6', name: 'Regional Learning Hub', region: 'North-east district', risk: 'high', x: 88, y: 58 },
  ],
  recentInspections: [
    { id: 'insp-1', project: 'ABC Skill Development Centre', inspector: 'Rahul Kumar', date: '30 Sep 2026', status: 'Completed', risk: 'High' },
    { id: 'insp-2', project: 'XYZ Welfare Centre', inspector: 'Aman Singh', date: '30 Sep 2026', status: 'Completed', risk: 'Medium' },
    { id: 'insp-3', project: 'Community Support Centre', inspector: 'Priya Sharma', date: '29 Sep 2026', status: 'Pending', risk: null },
    { id: 'insp-4', project: 'Rural Health Unit', inspector: 'Vikram Das', date: '29 Sep 2026', status: 'Completed', risk: 'Low' },
  ],
  recentAlerts: [
    { id: 'alert-1', type: 'risk', title: 'High Risk Project', description: 'ABC Foundation received a risk score of 82/100.', time: '10 min ago' },
    { id: 'alert-2', type: 'overdue', title: 'Inspection Overdue', description: 'XYZ Welfare Centre inspection is overdue.', time: '42 min ago' },
    { id: 'alert-3', type: 'location', title: 'Location Verification', description: 'Inspector successfully verified location.', time: '1 hour ago' },
  ],
};

async function getAdminDashboardData() {
  return dashboardData;
}

module.exports = { getAdminDashboardData };