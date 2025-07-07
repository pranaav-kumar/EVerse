const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/EVerse');
    console.log('✅ MongoDB connected to EVerse');
  } catch (err) {
    console.error('❌ MongoDB connection failed', err);
    process.exit(1);
  }
};

module.exports = connectDB;
