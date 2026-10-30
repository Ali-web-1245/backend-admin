const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, data: null, message: 'Access denied: admin role required' });
};

module.exports = isAdmin;
