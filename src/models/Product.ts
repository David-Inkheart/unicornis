import { model, Schema, Types, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ICategory } from './Category';

export interface IProduct {
  name: string;
  description: string;
  price: Types.Decimal128;
  quantity: number;
  category: string | ICategory;
  image: string;
  // active: boolean;
  // deletedAt: Date | null;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, maxlength: 100, required: true },
    description: { type: String, maxlength: 255, default: '' },
    price: { type: Types.Decimal128, required: true },
    quantity: { type: Number, default: 0, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    image: { type: String }, // URL to the image
    // active or inactive for soft delete
    // active: { type: Boolean, default: true },
    // deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

ProductSchema.plugin(mongoosePaginate);

type Product<T extends IProduct> = PaginateModel<T>;

export const Product: Product<IProduct> = model<IProduct>('Product', ProductSchema) as Product<IProduct>;
