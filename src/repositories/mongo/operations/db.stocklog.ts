import mongoose from 'mongoose';
import { StockLog } from '../../../models/Stocklog';
import { options } from '../../../utils/constants/random';

export const findStockLog = (data: mongoose.FilterQuery<any>) => {
  return StockLog.findOne(data);
};

export const findStockLogById = (id: string) => {
  return StockLog.findById(id);
};

// paginated inventory list with filters
export const getStockLogList = ({ page, limit, filters }: { page: number; limit: number; filters?: Record<string, any> }) => {
  options.page = page;
  options.limit = limit;

  let query: Record<string, any> = {};
  // Remove null or undefined members from the filters object
  if (filters) {
    query = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined));
  }

  // check if createdAt is an empty object
  if (query.createdAt && Object.keys(query.createdAt).length === 0) {
    delete query.createdAt;
  }

  return StockLog.paginate(query, options);
};

export const createStockLog = async (data: mongoose.FilterQuery<any>) => {
  const stocklog = new StockLog(data);
  return stocklog.save();
};

export const updateStockLog = (id: string, data: mongoose.UpdateQuery<any>) => {
  return StockLog.findByIdAndUpdate(
    {
      _id: id,
    },
    data,
    {
      new: true,
    },
  );
};

export const deleteStockLogById = (id: string) => {
  return StockLog.findByIdAndDelete(id);
};
