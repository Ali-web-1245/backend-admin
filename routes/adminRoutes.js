const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/authController');
const { getStats } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.route('/login').post(adminLogin);
router.route('/stats').get(auth, isAdmin, getStats);

module.exports = router;
