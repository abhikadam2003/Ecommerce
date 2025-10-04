require('dotenv').config();
const mongoose = require('mongoose');
const {connectDB} = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { ROLES } = require('../utils/roles');

async function seed() {
  try {
    await connectDB();

    // Optional: clean collections
    const wipe = process.argv.includes('--wipe');
    if (wipe) {
      await Promise.all([
        User.deleteMany({}),
        Category.deleteMany({}),
        Product.deleteMany({}),
      ]);
    }

    // Create admin user (no email notification here)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({ name: 'Admin', email: adminEmail, password: adminPassword, role: ROLES.ADMIN });
      // eslint-disable-next-line no-console
      console.log('Admin created:', adminEmail, 'password:', adminPassword);
    } else {
      // eslint-disable-next-line no-console
      console.log('Admin exists:', adminEmail);
    }

    // Categories
    const categoryNames = ['Electronics', 'Fashion', 'Home', 'Books'];
    const categories = [];
    for (const name of categoryNames) {
      let cat = await Category.findOne({ name });
      if (!cat) cat = await Category.create({ name });
      categories.push(cat);
    }

    // Dummy products
    const products = [
      { name: 'Wireless Headphones', description: 'Noise-cancelling over-ear', price: 149.99, stock: 50, images: [], category: categories[0]._id },
      { name: 'Smartphone Case', description: 'Shockproof', price: 19.99, stock: 150, images: [], category: categories[0]._id },
      { name: 'Casual T-Shirt', description: '100% cotton', price: 12.5, stock: 200, images: [], category: categories[1]._id },
      { name: 'Coffee Maker', description: '12-cup drip', price: 39.99, stock: 80, images: [], category: categories[2]._id },
      { name: 'Mystery Novel', description: 'Bestseller', price: 9.99, stock: 120, images: [], category: categories[3]._id },
    ];

    for (const p of products) {
      const exists = await Product.findOne({ name: p.name });
      if (!exists) await Product.create(p);
    }

    // eslint-disable-next-line no-console
    console.log('Seeding complete');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();