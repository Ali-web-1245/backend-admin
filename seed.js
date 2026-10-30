const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// yahan se aapka purana code (express require waghera)

require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Product = require('./models/Product');

const sampleProducts = [
  {
    title: 'Gradient Graphic T-shirt',
    price: 145,
    oldPrice: 180,
    discount: '20% off',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    category: 'T-shirts',
    stock: 25,
    description: 'Soft cotton t-shirt with a bold gradient graphic print on the front.',
  },
  {
    title: 'Polo with Tipping Details',
    price: 180,
    oldPrice: null,
    discount: null,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1520367449875-246a9398e29d?w=600',
    category: 'Polo Shirts',
    stock: 18,
    description: 'Classic polo shirt with tipping details on the collar and sleeves.',
  },
  {
    title: 'Black Striped T-shirt',
    price: 120,
    oldPrice: 150,
    discount: '20% off',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600',
    category: 'T-shirts',
    stock: 30,
    description: 'Everyday black tee with subtle horizontal stripes.',
  },
  {
    title: 'Skinny Fit Jeans',
    price: 240,
    oldPrice: 300,
    discount: '20% off',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
    category: 'Jeans',
    stock: 15,
    description: 'Stretchable skinny fit jeans with a modern slim silhouette.',
  },
  {
    title: 'Checkered Shirt',
    price: 180,
    oldPrice: null,
    discount: null,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',
    category: 'Shirts',
    stock: 22,
    description: 'Full-sleeve checkered shirt with a regular fit and soft finish.',
  },
  {
    title: 'Sleeve Striped T-shirt',
    price: 130,
    oldPrice: 160,
    discount: '15% off',
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600',
    category: 'T-shirts',
    stock: 28,
    description: 'Solid tee with contrast stripes on the sleeves.',
  },
  {
    title: 'Vertical Striped Shirt',
    price: 212,
    oldPrice: 265,
    discount: '20% off',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
    category: 'Shirts',
    stock: 12,
    description: 'Slim vertical stripes make this shirt a wardrobe essential.',
  },
  {
    title: 'Courage Graphic T-shirt',
    price: 145,
    oldPrice: null,
    discount: null,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1556306535-0f09a937c013?w=600',
    category: 'T-shirts',
    stock: 20,
    description: 'Statement graphic tee with a bold courage slogan print.',
  },
  {
    title: 'Loose Fit Bermuda Shorts',
    price: 80,
    oldPrice: 110,
    discount: '25% off',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600',
    category: 'Shorts',
    stock: 35,
    description: 'Comfortable loose-fit bermuda shorts, perfect for summer.',
  },
];

const seed = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    console.error('ADMIN_EMAIL / ADMIN_PASSWORD missing in .env');
    process.exit(1);
  }

  await Admin.deleteMany({});
  const hashed = await bcryptjs.hash(adminPassword, 10);
  await Admin.create({ email: adminEmail.toLowerCase(), password: hashed, role: 'admin' });
  console.log(`Admin created: ${adminEmail}`);

  await Product.deleteMany({});
  const products = await Product.insertMany(sampleProducts);
  console.log(`${products.length} sample products inserted`);

  await mongoose.connection.close();
  console.log('Seeding complete. DB connection closed.');
  process.exit(0);
};

seed().catch((err) => {
  console.error(`Seeding failed: ${err.message}`);
  process.exit(1);
});
