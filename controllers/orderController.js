const Order = require('../models/Order');
const Product = require('../models/Product');
const ErrorResponse = require('../middleware/errorResponse');

// POST /api/orders (public)
exports.createOrder = async (req, res, next) => {
  const { items, customerInfo, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return next(new ErrorResponse('Order must contain at least one item', 400));
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return next(new ErrorResponse(`Product not found: ${item.productId}`, 404));
    }
    const quantity = item.quantity && Number.isInteger(Number(item.quantity)) ? Number(item.quantity) : 1;
    orderItems.push({
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.image,
    });
    totalAmount += product.price * quantity;
  }

  const order = await Order.create({
    items: orderItems,
    customerInfo,
    paymentMethod: paymentMethod || 'cod',
    totalAmount,
  });

  res.status(201).json({
    success: true,
    data: { order },
    message: 'Order placed successfully',
  });
};

// GET /api/orders (admin)
exports.getOrders = async (req, res, next) => {
  const { status } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

  const filter = status ? { status } : {};

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: {
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    },
    message: 'Orders fetched successfully',
  });
};

// PUT /api/orders/:id (admin)
exports.updateOrderStatus = async (req, res, next) => {
  const { status } = req.body;
  const allowed = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!status || !allowed.includes(status)) {
    return next(new ErrorResponse(`Invalid status. Allowed: ${allowed.join(', ')}`, 400));
  }

  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  res.status(200).json({ success: true, data: { order }, message: 'Order status updated successfully' });
};
