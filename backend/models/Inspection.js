const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema(
  {
    inspectionCode: { type: String, required: true, unique: true, trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignmentType: { type: String, enum: ['random', 'manual'], default: 'random', required: true },
    status: {
      type: String,
      enum: ['assigned', 'accepted', 'in_progress', 'completed', 'overdue', 'cancelled'],
      default: 'assigned',
      required: true,
      index: true,
    },
    assignedAt: { type: Date, default: Date.now, required: true },
    deadline: { type: Date, required: true, index: true },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: null },
    notes: { type: String, trim: true, maxlength: 2000, default: '' },
    activeProjectKey: { type: mongoose.Schema.Types.ObjectId, default: undefined },
  },
  { timestamps: true },
);

inspectionSchema.index({ activeProjectKey: 1 }, { unique: true, sparse: true });
inspectionSchema.index({ inspector: 1, assignedAt: -1 });

module.exports = mongoose.model('Inspection', inspectionSchema);