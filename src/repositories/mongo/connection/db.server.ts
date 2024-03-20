import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DATABASE_URL as string;
const dbconnect = async () => {
  try {
    await mongoose.connect(url, {});
    mongoose.set('debug', true);
    console.log(`Connected to Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.log(error);
  }
};

export default dbconnect;
