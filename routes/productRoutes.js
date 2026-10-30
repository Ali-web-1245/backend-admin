const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.route('/').get(getProducts);
router.route('/:id').get(getProduct);

// Admin-protected
router.route('/').post(auth, isAdmin, createProduct);
router.route('/:id').put(auth, isAdmin, updateProduct);
router.route('/:id').delete(auth, isAdmin, deleteProduct);

module.exports = router;
