const mongoose = require('mongoose');
const Project = require('../models/Project');
const { getProjectInspectionHistory } = require('../data/projectInspectionMock');

const allowedStatuses = ['active', 'inactive', 'suspended'];
const allowedRiskLevels = ['low', 'medium', 'high'];
const allowedProjectTypes = [
  'Skill Development',
  'Education',
  'Healthcare',
  'Social Welfare',
  'Rehabilitation',
  'Other',
];
const requiredTextFields = [
  'projectName',
  'projectCode',
  'ngoName',
  'contactPerson',
  'contactPhone',
  'address',
  'city',
  'state',
  'pincode',
];
const sortableFields = {
  projectName: 'projectName',
  beneficiaryCount: 'beneficiaryCount',
  riskScore: 'riskScore',
  createdAt: 'createdAt',
};

function validateProjectInput(body) {
  const errors = {};

  for (const field of requiredTextFields) {
    if (typeof body[field] !== 'string' || !body[field].trim()) {
      errors[field] = 'This field is required.';
    }
  }

  if (body.projectType && !allowedProjectTypes.includes(body.projectType)) {
    errors.projectType = 'Choose a valid project type.';
  }

  if (body.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.contactEmail)) {
    errors.contactEmail = 'Enter a valid email address.';
  }

  if (typeof body.contactPhone === 'string' && !/^\+?[0-9][0-9\s()-]{7,19}$/.test(body.contactPhone.trim())) {
    errors.contactPhone = 'Enter a valid phone number.';
  }

  if (typeof body.pincode === 'string' && !/^\d{6}$/.test(body.pincode.trim())) {
    errors.pincode = 'Pincode must contain 6 digits.';
  }

  const beneficiaryCount = Number(body.beneficiaryCount);
  if (!Number.isInteger(beneficiaryCount) || beneficiaryCount < 1) {
    errors.beneficiaryCount = 'Enter a positive whole number.';
  }

  const latitude = Number(body.latitude);
  if (body.latitude === '' || body.latitude === null || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    errors.latitude = 'Latitude must be between -90 and 90.';
  }

  const longitude = Number(body.longitude);
  if (body.longitude === '' || body.longitude === null || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    errors.longitude = 'Longitude must be between -180 and 180.';
  }

  if (body.status && !allowedStatuses.includes(body.status)) {
    errors.status = 'Choose a valid project status.';
  }

  if (body.riskLevel && !allowedRiskLevels.includes(body.riskLevel)) {
    errors.riskLevel = 'Choose a valid risk level.';
  }

  if (body.riskScore !== undefined && (!Number.isFinite(Number(body.riskScore)) || Number(body.riskScore) < 0 || Number(body.riskScore) > 100)) {
    errors.riskScore = 'Risk score must be between 0 and 100.';
  }

  if (body.startDate && Number.isNaN(new Date(body.startDate).getTime())) {
    errors.startDate = 'Enter a valid start date.';
  }

  return errors;
}

function projectPayload(body) {
  const payload = {};
  const fields = [
    ...requiredTextFields,
    'ngoRegistrationNumber',
    'projectType',
    'description',
    'contactEmail',
    'latitude',
    'longitude',
    'beneficiaryCount',
    'startDate',
    'status',
    'riskLevel',
    'riskScore',
  ];

  for (const field of fields) {
    if (body[field] !== undefined) payload[field] = body[field];
  }

  payload.projectCode = String(payload.projectCode || '').trim().toUpperCase();
  payload.beneficiaryCount = Number(payload.beneficiaryCount);
  payload.latitude = Number(payload.latitude);
  payload.longitude = Number(payload.longitude);
  if (payload.riskScore !== undefined) payload.riskScore = Number(payload.riskScore);
  return payload;
}

function isDuplicateCode(error) {
  return error?.code === 11000 && (error.keyPattern?.projectCode || error.keyValue?.projectCode);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function listProjects(req, res) {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
  const sortField = sortableFields[req.query.sortBy] || 'createdAt';
  const sortDirection = req.query.sortOrder === 'asc' ? 1 : -1;
  const filter = {};

  if (req.query.status && req.query.status !== 'all') {
    if (!allowedStatuses.includes(req.query.status)) return res.status(400).json({ message: 'Invalid status filter.' });
    filter.status = req.query.status;
  }

  if (req.query.riskLevel && req.query.riskLevel !== 'all') {
    if (!allowedRiskLevels.includes(req.query.riskLevel)) return res.status(400).json({ message: 'Invalid risk filter.' });
    filter.riskLevel = req.query.riskLevel;
  }

  if (req.query.state && req.query.state !== 'all') filter.state = req.query.state;

  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  if (search) {
    const expression = new RegExp(escapeRegex(search), 'i');
    filter.$or = [
      { projectName: expression },
      { ngoName: expression },
      { projectCode: expression },
      { city: expression },
    ];
  }

  try {
    const [projects, total, states] = await Promise.all([
      Project.find(filter)
        .sort({ [sortField]: sortDirection, _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Project.countDocuments(filter),
      Project.distinct('state'),
    ]);

    const withInspectionData = projects.map((project) => {
      const history = getProjectInspectionHistory(project);
      return { ...project, lastInspection: history[0]?.date || null };
    });

    return res.status(200).json({
      projects: withInspectionData,
      states: states.sort((left, right) => left.localeCompare(right)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('List projects error:', error);
    return res.status(500).json({ message: 'Unable to load projects.' });
  }
}

async function getProject(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project ID.' });

  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    return res.status(200).json({
      project,
      inspectionHistory: getProjectInspectionHistory(project),
    });
  } catch (error) {
    console.error('Get project error:', error);
    return res.status(500).json({ message: 'Unable to load project.' });
  }
}

async function createProject(req, res) {
  const body = req.body || {};
  const errors = validateProjectInput(body);
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please correct the project fields.', errors });

  try {
    const project = await Project.create(projectPayload(body));
    return res.status(201).json({ project });
  } catch (error) {
    if (isDuplicateCode(error)) return res.status(409).json({ message: 'A project with this project code already exists.', field: 'projectCode' });
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: 'Please correct the project fields.' });
    }
    console.error('Create project error:', error);
    return res.status(500).json({ message: 'Unable to create project.' });
  }
}

async function updateProject(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project ID.' });
  const body = req.body || {};
  const errors = validateProjectInput(body);
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please correct the project fields.', errors });

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    project.set(projectPayload(body));
    await project.save();
    return res.status(200).json({ project });
  } catch (error) {
    if (isDuplicateCode(error)) return res.status(409).json({ message: 'A project with this project code already exists.', field: 'projectCode' });
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: 'Please correct the project fields.' });
    }
    console.error('Update project error:', error);
    return res.status(500).json({ message: 'Unable to update project.' });
  }
}

async function updateProjectStatus(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project ID.' });
  if (!allowedStatuses.includes(req.body?.status)) return res.status(400).json({ message: 'Choose a valid project status.' });

  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    );
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    return res.status(200).json({ project });
  } catch (error) {
    console.error('Update project status error:', error);
    return res.status(500).json({ message: 'Unable to update project status.' });
  }
}

async function deleteProject(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project ID.' });

  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    return res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ message: 'Unable to delete project.' });
  }
}

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  updateProjectStatus,
  deleteProject,
};