import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../../../utils/winston';

dotenv.config();

const url = process.env.DATABASE_URL as string;
const dbconnect = async () => {
  try {
    await mongoose.connect(url, {});
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }
    logger.info(`Connected to Database: ${mongoose.connection.name} 🚀`);
  } catch (error) {
    logger.error(`Error connecting to Database: ${error} 💥`);
  }
};

export default dbconnect;
