import mongoose from 'mongoose';
import { StockLog } from '../../../models/Stocklog';

export const findStockLog = (data: mongoose.FilterQuery<any>) => {
  return StockLog.findOne(data);
};

export const findStockLogById = (id: string) => {
  return StockLog.findById(id);
};

export const getStockLogList = () => {
  return StockLog.find();
};

export const createStockLog = (data: mongoose.FilterQuery<any>) => {
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
