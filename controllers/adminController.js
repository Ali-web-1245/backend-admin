const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

exports.getStats = async (req, res, next) => {
  const [totalProducts, totalOrders, totalCustomers, recentOrders, revenueData] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5),
    Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }]),
  ]);

  const totalRevenue = revenueData.length ? revenueData[0].totalRevenue : 0;

  res.status(200).json({
    success: true,
    data: {
      totalProducts,
      totalOrders,
      totalRevenue,
      totalCustomers,
      recentOrders,
    },
    message: 'Dashboard stats fetched successfully',
  });
};
