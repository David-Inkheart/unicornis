import { model, Schema, PaginateModel, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface ICategory extends Document {
  name: string;
  description: string;
  products: string[];
  // active: boolean;
  // deletedAt: Date | null;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, maxlength: 100, required: true },
    description: { type: String, maxlength: 255, default: '' },
    // active or inactive for soft delete
    // active: { type: Boolean, default: true },
    // deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

CategorySchema.plugin(mongoosePaginate);

type Category<T extends Document> = PaginateModel<T>;

export const Category: Category<ICategory> = model<ICategory>('Category', CategorySchema) as Category<ICategory>;
