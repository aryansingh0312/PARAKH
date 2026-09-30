const mongoose = require('mongoose');

const projectTypes = [
  'Skill Development',
  'Education',
  'Healthcare',
  'Social Welfare',
  'Rehabilitation',
  'Other',
];

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true, trim: true, maxlength: 160 },
    projectCode: { type: String, required: true, unique: true, uppercase: true, trim: true, maxlength: 40 },
    ngoName: { type: String, required: true, trim: true, maxlength: 160 },
    ngoRegistrationNumber: { type: String, trim: true, maxlength: 80, default: '' },
    projectType: { type: String, enum: projectTypes, required: true, default: 'Other' },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    contactPerson: { type: String, required: true, trim: true, maxlength: 120 },
    contactPhone: { type: String, required: true, trim: true, maxlength: 24 },
    contactEmail: { type: String, trim: true, lowercase: true, maxlength: 254, default: '' },
    address: { type: String, required: true, trim: true, maxlength: 240 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    state: { type: String, required: true, trim: true, maxlength: 100 },
    pincode: { type: String, required: true, trim: true, match: /^\d{6}$/ },
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    beneficiaryCount: { type: Number, required: true, min: 1, validate: Number.isInteger },
    startDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active', required: true },
    riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low', required: true },
    riskScore: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true },
);

projectSchema.index({ projectName: 'text', ngoName: 'text', projectCode: 'text', city: 'text' });

module.exports = mongoose.model('Project', projectSchema);