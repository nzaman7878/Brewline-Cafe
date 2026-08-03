import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { connectDB } from '../config/db.js';

dotenv.config({ path: '../../.env' }); // load from root if needed or assume running from server root

const seedAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@brewlinecafe.com' });
    if (existingAdmin) {
      console.log('Admin already exists! Deleting to recreate...');
      await User.deleteOne({ email: 'admin@brewlinecafe.com' });
    }

    await User.create({
      firstName: 'Admin',
      lastName: 'Brewline',
      email: 'admin@brewlinecafe.com',
      password: 'password123',
      role: 'admin',
      phone: '1234567890'
    });

    console.log('✅ Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
