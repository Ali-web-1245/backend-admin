const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    oldPrice: { type: Number, min: 0, default: undefined },
    discount: { type: String, default: undefined, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    image: { type: String, required: [true, 'Image URL is required'], trim: true },
    category: { type: String, required: [true, 'Category is required'], trim: true, index: true },
    stock: { type: Number, default: 0, min: 0 },
    description: { type: String, default: '', trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('Product', productSchema);
