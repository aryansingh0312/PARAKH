function getProjectInspectionHistory(project) {
  return [
    {
      id: `${project._id}-inspection-1`,
      date: new Date('2026-09-30T10:00:00.000Z'),
      inspector: project.contactPerson || 'Rahul Kumar',
      status: 'Completed',
      risk: project.riskLevel,
    },
    {
      id: `${project._id}-inspection-2`,
      date: new Date('2026-09-12T10:00:00.000Z'),
      inspector: 'Aman Singh',
      status: 'Completed',
      risk: 'Medium',
    },
    {
      id: `${project._id}-inspection-3`,
      date: new Date('2026-08-20T10:00:00.000Z'),
      inspector: 'Priya Sharma',
      status: 'Completed',
      risk: 'Low',
    },
  ];
}

module.exports = { getProjectInspectionHistory };