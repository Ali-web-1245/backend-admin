const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.route('/').post(createOrder);

// Admin-protected
router.route('/').get(auth, isAdmin, getOrders);
router.route('/:id').put(auth, isAdmin, updateOrderStatus);

module.exports = router;
