const mongoose = require('mongoose');

const inspectionCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    value: { type: Number, default: 0 },
  },
  { versionKey: false },
);

module.exports = mongoose.model('InspectionCounter', inspectionCounterSchema);