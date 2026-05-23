import mongoose from 'mongoose';

export async function connectDB() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/questora';
  
  try {
    await mongoose.connect(mongoURI);
    console.log('Successfully connected to MongoDB database');
  } catch (error) {
    console.error('Failed to establish database connection:', error);
    process.exit(1);
  }
}
