import { model, Schema } from 'mongoose';
import { IProduct } from './Product';

export interface IStockLog {
  product: string | IProduct;
  transactionType: 'sold' | 'restocked';
  quantity: number;
  reference: string;
}

const StockLogSchema = new Schema<IStockLog>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    transactionType: { type: String, enum: ['sold', 'restocked'], required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true },
);

export const StockLog = model<IStockLog>('StockLog', StockLogSchema);
