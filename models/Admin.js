const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    role: { type: String, default: 'admin', immutable: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('Admin', adminSchema);
