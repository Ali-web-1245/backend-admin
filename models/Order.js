const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        image: { type: String, default: '' },
      },
    ],
    customerInfo: {
      name: { type: String, required: [true, 'Customer name is required'], trim: true },
      email: { type: String, required: [true, 'Customer email is required'], trim: true, lowercase: true },
      phone: { type: String, required: [true, 'Customer phone is required'], trim: true },
      address: { type: String, required: [true, 'Customer address is required'], trim: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cod', 'card', 'online'],
      default: 'cod',
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('Order', orderSchema);
