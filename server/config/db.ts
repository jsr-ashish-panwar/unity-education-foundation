import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

export const connectDB = async (): Promise<boolean> => {
  if (!MONGODB_URI) {
    console.warn('\x1b[33m%s\x1b[0m', 'WARNING: MONGODB_URI environment variable is not defined. Server will run in MOCK mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log('\x1b[32m%s\x1b[0m', `MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `Error connecting to MongoDB: ${(error as Error).message}`);
    console.warn('\x1b[33m%s\x1b[0m', 'Server will run in MOCK mode due to connection failure.');
    return false;
  }
};
