const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI || mongoURI === 'your_private_mongodb_connection_string') {
      console.error('MongoDB connection failed: MONGO_URI is missing or unconfigured in .env');
      return;
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
};

module.exports = connectDB;