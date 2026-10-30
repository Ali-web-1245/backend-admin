const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const ErrorResponse = require('../middleware/errorResponse');

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new ErrorResponse('Email is already registered', 400));
  }

  const hashed = await bcryptjs.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  const token = signToken({ id: user._id, email: user.email, role: 'customer' });

  res.status(201).json({
    success: true,
    data: { user: { id: user._id, name: user.name, email: user.email }, token },
    message: 'Registration successful',
  });
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcryptjs.compare(password, user.password))) {
    return next(new ErrorResponse('Invalid email or password', 401));
  }

  const token = signToken({ id: user._id, email: user.email, role: 'customer' });

  res.status(200).json({
    success: true,
    data: { user: { id: user._id, name: user.name, email: user.email }, token },
    message: 'Login successful',
  });
};

// POST /api/admin/login
exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await bcryptjs.compare(password, admin.password))) {
    return next(new ErrorResponse('Invalid admin credentials', 401));
  }

  const token = signToken({ id: admin._id, email: admin.email, role: 'admin' });

  res.status(200).json({
    success: true,
    data: { admin: { id: admin._id, email: admin.email }, token },
    message: 'Admin login successful',
  });
};
