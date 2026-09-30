const mongoose = require('mongoose');
const Inspection = require('../models/Inspection');
const {
  activeStatuses,
  markOverdueAssignments,
  getAssignmentEligibility,
  generateRandomInspection,
  getInspectionById,
  changeInspectionStatus,
} = require('../services/randomInspectionService');

const statuses = ['assigned', 'accepted', 'in_progress', 'completed', 'overdue', 'cancelled'];
const assignmentTypes = ['random', 'manual'];

function presentInspection(inspection) {
  const project = inspection.project;
  const inspector = inspection.inspector;
  const assignedBy = inspection.assignedBy;
  return {
    id: inspection._id.toString(),
    inspectionCode: inspection.inspectionCode,
    project: project ? {
      id: project._id.toString(),
      name: project.projectName,
      projectCode: project.projectCode,
      ngoName: project.ngoName,
      address: project.address,
      city: project.city,
      state: project.state,
      pincode: project.pincode,
      latitude: project.latitude,
      longitude: project.longitude,
      beneficiaryCount: project.beneficiaryCount,
      status: project.status,
    } : null,
    inspector: inspector ? { id: inspector._id.toString(), name: inspector.name, email: inspector.email } : null,
    assignedBy: assignedBy ? { id: assignedBy._id.toString(), name: assignedBy.name, email: assignedBy.email } : null,
    assignmentType: inspection.assignmentType,
    status: inspection.status,
    assignedAt: inspection.assignedAt,
    deadline: inspection.deadline,
    startedAt: inspection.startedAt,
    completedAt: inspection.completedAt,
    riskLevel: inspection.riskLevel,
    notes: inspection.notes,
    createdAt: inspection.createdAt,
    updatedAt: inspection.updatedAt,
  };
}

async function getEligibility(req, res) {
  try {
    const eligibility = await getAssignmentEligibility();
    return res.status(200).json(eligibility);
  } catch (error) {
    console.error('Inspection eligibility error:', error);
    return res.status(500).json({ message: 'Unable to load assignment availability.' });
  }
}

async function createRandomInspection(req, res) {
  try {
    const inspection = await generateRandomInspection({
      deadline: req.body?.deadline,
      assignedBy: req.user.userId,
    });
    return res.status(201).json({ success: true, inspection: presentInspection(inspection) });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error('Random inspection assignment error:', error);
    return res.status(500).json({ message: 'Unable to create random inspection assignment.' });
  }
}

function parseDateRange(dateRange) {
  const now = new Date();
  if (dateRange === 'today') {
    const start = new Date(now);
    start.setUTCHours(0, 0, 0, 0);
    return { $gte: start };
  }
  if (dateRange === '7d') return { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
  if (dateRange === '30d') return { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
  return null;
}

async function listInspections(req, res) {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
  const filter = {};

  if (req.user.role === 'inspector') filter.inspector = req.user.userId;
  if (req.query.status && req.query.status !== 'all') {
    if (!statuses.includes(req.query.status)) return res.status(400).json({ message: 'Invalid inspection status filter.' });
    filter.status = req.query.status;
  }
  if (req.query.assignmentType && req.query.assignmentType !== 'all') {
    if (!assignmentTypes.includes(req.query.assignmentType)) return res.status(400).json({ message: 'Invalid assignment type filter.' });
    filter.assignmentType = req.query.assignmentType;
  }
  const assignedAt = parseDateRange(req.query.dateRange);
  if (assignedAt) filter.assignedAt = assignedAt;
  else if (req.query.dateRange && req.query.dateRange !== 'all') return res.status(400).json({ message: 'Invalid date filter.' });

  try {
    await markOverdueAssignments();
    const [inspections, total, counts] = await Promise.all([
      Inspection.find(filter)
        .populate('project', 'projectName projectCode ngoName address city state pincode latitude longitude beneficiaryCount status')
        .populate('inspector', 'name email')
        .populate('assignedBy', 'name email')
        .sort({ assignedAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Inspection.countDocuments(filter),
      Inspection.aggregate([
        { $match: req.user.role === 'inspector' ? { inspector: new mongoose.Types.ObjectId(req.user.userId) } : {} },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);
    const countMap = Object.fromEntries(counts.map(({ _id, count }) => [_id, count]));

    return res.status(200).json({
      inspections: inspections.map(presentInspection),
      stats: {
        assigned: (countMap.assigned || 0) + (countMap.accepted || 0),
        inProgress: countMap.in_progress || 0,
        completed: countMap.completed || 0,
        overdue: countMap.overdue || 0,
      },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('List inspections error:', error);
    return res.status(500).json({ message: 'Unable to load inspections.' });
  }
}

async function getInspection(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid inspection ID.' });

  try {
    const inspection = await getInspectionById(req.params.id);
    if (!inspection) return res.status(404).json({ message: 'Inspection not found.' });
    if (req.user.role === 'inspector' && inspection.inspector?._id.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Inspection not found.' });
    }
    return res.status(200).json({ inspection: presentInspection(inspection) });
  } catch (error) {
    console.error('Get inspection error:', error);
    return res.status(500).json({ message: 'Unable to load inspection.' });
  }
}

async function updateInspectionStatus(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid inspection ID.' });

  try {
    const inspection = await getInspectionById(req.params.id);
    if (!inspection) return res.status(404).json({ message: 'Inspection not found.' });
    if (req.user.role === 'inspector' && inspection.inspector?._id.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Inspection not found.' });
    }
    if (req.user.role === 'inspector' && !['accepted', 'in_progress', 'completed'].includes(req.body?.status)) {
      return res.status(403).json({ message: 'Inspectors may only accept, start, or complete their own inspections.' });
    }

    const updated = await changeInspectionStatus(inspection, req.body?.status);
    return res.status(200).json({ inspection: presentInspection(updated) });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error('Update inspection status error:', error);
    return res.status(500).json({ message: 'Unable to update inspection status.' });
  }
}

module.exports = {
  getEligibility,
  createRandomInspection,
  listInspections,
  getInspection,
  updateInspectionStatus,
};