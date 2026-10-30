const Product = require('../models/Product');
const ErrorResponse = require('../middleware/errorResponse');

// GET /api/products?category=&minPrice=&maxPrice=&sort=&page=&limit=
exports.getProducts = async (req, res, next) => {
  const { category, minPrice, maxPrice, sort } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 100);

  const filter = {};
  if (category) filter.category = { $regex: `^${category}$`, $options: 'i' };
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined && minPrice !== '') filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined && maxPrice !== '') filter.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    newest: { createdAt: -1 },
    title: { title: 1 },
    rating: { rating: -1 },
  };
  const sortOption = sortMap[sort] || { createdAt: -1 };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    },
    message: 'Products fetched successfully',
  });
};

// GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }
  res.status(200).json({ success: true, data: { product }, message: 'Product fetched successfully' });
};

// POST /api/products (admin)
exports.createProduct = async (req, res, next) => {
  const { title, price, oldPrice, discount, rating, image, category, stock, description } = req.body;

  const product = await Product.create({
    title,
    price,
    oldPrice,
    discount,
    rating,
    image,
    category,
    stock,
    description,
  });

  res.status(201).json({ success: true, data: { product }, message: 'Product created successfully' });
};

// PUT /api/products/:id (admin)
exports.updateProduct = async (req, res, next) => {
  const allowed = ['title', 'price', 'oldPrice', 'discount', 'rating', 'image', 'category', 'stock', 'description'];
  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const product = await Product.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  res.status(200).json({ success: true, data: { product }, message: 'Product updated successfully' });
};

// DELETE /api/products/:id (admin)
exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }
  res.status(200).json({ success: true, data: { id: req.params.id }, message: 'Product deleted successfully' });
};
