const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri?.startsWith('mongodb+srv://')) {
    throw new Error('MONGODB_URI must be a MongoDB Atlas connection string starting with mongodb+srv://.');
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log('Connected to MongoDB Atlas.');
}

module.exports = { connectDatabase };
