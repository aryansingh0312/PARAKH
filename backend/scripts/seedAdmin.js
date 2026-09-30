const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connectDatabase } = require('../config/db');
const User = require('../models/User');

dotenv.config();

async function seedAdmin() {
  await connectDatabase();

  const email = process.env.DEVELOPMENT_ADMIN_EMAIL || 'admin@parakh.gov';
  const password = process.env.DEVELOPMENT_ADMIN_PASSWORD || 'ChangeThisPassword123!';

  const existing = await User.findOne({ email });

  if (existing) {
    console.log('Development admin already exists.');
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name: 'PARAKH Administrator',
    email,
    password: hashedPassword,
    role: 'admin',
    isActive: true,
  });

  console.log('Development admin created successfully.');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('This is DEVELOPMENT ONLY and should be removed before production deployment.');

  await mongoose.disconnect();
}

seedAdmin().catch((error) => {
  console.error('Seed admin error:', error);
  process.exit(1);
});
