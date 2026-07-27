import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

// Load environment variables from .env.
dotenv.config();

// MongoDB connection string for the sample database.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/computer-store';

// Create sample products that will be inserted into MongoDB.
const sampleProducts = [
  {
    name: 'Dell XPS 15 Laptop',
    description: 'Ultra-light premium laptop with 4K display and excellent battery life.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    stock: 8,
    active: true,
    featured: true,
  },
  {
    name: 'Logitech G Pro Wireless',
    description: 'High-performance gaming mouse with ultra-fast response and ergonomic design.',
    price: 129,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815476db?auto=format&fit=crop&w=900&q=80',
    stock: 15,
    active: true,
    featured: true,
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Noise-canceling wireless headphones with crystal clear sound.',
    price: 349,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    stock: 12,
    active: true,
    featured: false,
  },
  {
    name: 'Samsung 27" Curved Monitor',
    description: 'Immersive display for work and gaming with vibrant color accuracy.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    stock: 10,
    active: true,
    featured: false,
  },
  {
    name: 'Razer BlackWidow V4',
    description: 'Mechanical keyboard with tactile switches and RGB lighting.',
    price: 179,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    stock: 7,
    active: true,
    featured: false,
  },
];

// Seed function connects to MongoDB and inserts the sample products.
const seedProducts = async () => {
  try {
    // Connect to MongoDB.
    await mongoose.connect(MONGO_URI);
    // Remove any existing products before inserting the new sample set.
    await Product.deleteMany({});
    // Insert all sample products into the database.
    await Product.insertMany(sampleProducts);
    console.log('Seeded sample products');
  } catch (error) {
    // Print any error that happens during seeding.
    console.error('Seeding failed:', error);
  } finally {
    // Always disconnect after the operation finishes.
    mongoose.disconnect();
  }
};

// Run the seeding process when this file is executed.
seedProducts();
