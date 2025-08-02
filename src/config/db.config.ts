import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms';
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connected');
}
