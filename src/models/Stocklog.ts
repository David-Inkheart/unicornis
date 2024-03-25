import { model, Schema, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IProduct } from './Product';
import { IUser } from './User';

export interface IStockLog {
  product: IProduct;
  user: IUser;
  transactionType: 'sold' | 'restocked';
  quantity: number;
  reference?: string;
}

const StockLogSchema = new Schema<IStockLog>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    transactionType: { type: String, enum: ['sold', 'restocked'], required: true },
    quantity: { type: Number, required: true },
    reference: { type: String },
  },
  { timestamps: true },
);

StockLogSchema.plugin(mongoosePaginate);

type StockLog<T extends IStockLog> = PaginateModel<T>;

export const StockLog: StockLog<IStockLog> = model<IStockLog>('StockLog', StockLogSchema) as StockLog<IStockLog>;
