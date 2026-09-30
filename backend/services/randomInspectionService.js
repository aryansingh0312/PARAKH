const Inspection = require('../models/Inspection');
const InspectionCounter = require('../models/InspectionCounter');
const Project = require('../models/Project');
const User = require('../models/User');

const activeStatuses = ['assigned', 'accepted', 'in_progress'];
const transitionStatuses = ['assigned', 'accepted', 'in_progress', 'completed', 'overdue', 'cancelled'];

function pickRandom(items) {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

async function markOverdueAssignments(now = new Date()) {
  await Inspection.updateMany(
    { status: { $in: activeStatuses }, deadline: { $lte: now } },
    { $set: { status: 'overdue' }, $unset: { activeProjectKey: '' } },
  );
}

async function getAssignmentEligibility() {
  await markOverdueAssignments();
  const [projects, activeProjectIds, inspectors] = await Promise.all([
    Project.find({ status: 'active' }).select('_id').lean(),
    Inspection.distinct('project', { status: { $in: activeStatuses } }),
    User.countDocuments({ role: 'inspector', isActive: true }),
  ]);

  const activeIdSet = new Set(activeProjectIds.map((id) => id.toString()));
  return {
    eligibleProjects: projects.filter((project) => !activeIdSet.has(project._id.toString())).length,
    eligibleInspectors: inspectors,
  };
}

async function nextInspectionCode(year) {
  const sequence = await InspectionCounter.findOneAndUpdate(
    { _id: `inspection-${year}` },
    { $inc: { value: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  return `INS-${year}-${String(sequence.value).padStart(4, '0')}`;
}

async function getInspectorWorkloads(inspectorIds) {
  const groups = await Inspection.aggregate([
    { $match: { inspector: { $in: inspectorIds }, status: { $in: activeStatuses } } },
    { $group: { _id: '$inspector', count: { $sum: 1 } } },
  ]);
  return new Map(groups.map((group) => [group._id.toString(), group.count]));
}

async function chooseInspector(project, inspectors, workloads, now) {
  const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentInspectorIds = await Inspection.distinct('inspector', {
    project: project._id,
    status: 'completed',
    completedAt: { $gte: cutoff },
    inspector: { $in: inspectors.map((inspector) => inspector._id) },
  });
  const recentSet = new Set(recentInspectorIds.map((id) => id.toString()));
  const notRecentlyAssigned = inspectors.filter((inspector) => !recentSet.has(inspector._id.toString()));
  const candidates = notRecentlyAssigned.length ? notRecentlyAssigned : inspectors;
  const lowestWorkload = Math.min(...candidates.map((inspector) => workloads.get(inspector._id.toString()) || 0));
  const leastBusy = candidates.filter((inspector) => (workloads.get(inspector._id.toString()) || 0) === lowestWorkload);
  return pickRandom(leastBusy);
}

async function populateInspection(inspection) {
  await inspection.populate([
    { path: 'project', select: 'projectName projectCode ngoName address city state pincode latitude longitude beneficiaryCount status' },
    { path: 'inspector', select: 'name email role isActive' },
    { path: 'assignedBy', select: 'name email role' },
  ]);
  return inspection;
}

async function generateRandomInspection({ deadline, assignedBy, now = new Date() }) {
  const parsedDeadline = new Date(deadline);
  if (!deadline || Number.isNaN(parsedDeadline.getTime()) || parsedDeadline <= now) {
    const error = new Error('Choose an inspection deadline in the future.');
    error.status = 400;
    throw error;
  }

  await markOverdueAssignments(now);
  const [projects, inspectors] = await Promise.all([
    Project.find({ status: 'active' }).lean(),
    User.find({ role: 'inspector', isActive: true }).select('_id name email role isActive').lean(),
  ]);

  if (!projects.length) {
    const error = new Error('No active projects are available for random assignment.');
    error.status = 409;
    throw error;
  }
  if (!inspectors.length) {
    const error = new Error('No active inspectors are available for random assignment.');
    error.status = 409;
    throw error;
  }

  const activeProjectIds = await Inspection.distinct('project', { status: { $in: activeStatuses } });
  const activeSet = new Set(activeProjectIds.map((id) => id.toString()));
  const candidateProjects = projects.filter((project) => !activeSet.has(project._id.toString()));
  if (!candidateProjects.length) {
    const error = new Error('No projects are currently available for random assignment.');
    error.status = 409;
    throw error;
  }

  const workloads = await getInspectorWorkloads(inspectors.map((inspector) => inspector._id));
  while (candidateProjects.length) {
    const project = pickRandom(candidateProjects);
    candidateProjects.splice(candidateProjects.indexOf(project), 1);
    const inspector = await chooseInspector(project, inspectors, workloads, now);
    const inspectionCode = await nextInspectionCode(now.getFullYear());

    try {
      const inspection = await Inspection.create({
        inspectionCode,
        project: project._id,
        inspector: inspector._id,
        assignedBy,
        assignmentType: 'random',
        status: 'assigned',
        assignedAt: now,
        deadline: parsedDeadline,
        activeProjectKey: project._id,
      });
      return populateInspection(inspection);
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.activeProjectKey) continue;
      throw error;
    }
  }

  const error = new Error('No projects are currently available for random assignment.');
  error.status = 409;
  throw error;
}

async function getInspectionById(id) {
  await markOverdueAssignments();
  const inspection = await Inspection.findById(id);
  if (!inspection) return null;
  return populateInspection(inspection);
}

async function changeInspectionStatus(inspection, status) {
  if (!transitionStatuses.includes(status)) {
    const error = new Error('Invalid inspection status.');
    error.status = 400;
    throw error;
  }

  const allowedTransitions = {
    assigned: ['accepted', 'cancelled', 'overdue'],
    accepted: ['in_progress', 'overdue'],
    in_progress: ['completed', 'overdue'],
    completed: [],
    overdue: [],
    cancelled: [],
  };

  if (!allowedTransitions[inspection.status]?.includes(status)) {
    const error = new Error(`Inspection cannot move from ${inspection.status} to ${status}.`);
    error.status = 409;
    throw error;
  }

  const updates = { status };
  if (status === 'in_progress') updates.startedAt = new Date();
  if (status === 'completed') updates.completedAt = new Date();
  inspection.set(updates);
  if (!activeStatuses.includes(status)) inspection.activeProjectKey = undefined;
  await inspection.save();
  return populateInspection(inspection);
}

module.exports = {
  activeStatuses,
  markOverdueAssignments,
  getAssignmentEligibility,
  generateRandomInspection,
  getInspectionById,
  changeInspectionStatus,
};