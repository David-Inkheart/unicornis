import { model, Schema } from 'mongoose';

export interface ICategory {
  name: string;
  description: string;
  active: boolean;
  deletedAt: Date | null;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, maxlength: 100, required: true },
    description: { type: String, maxlength: 255 },
    // active or inactive for soft delete
    // active: { type: Boolean, default: true },
    // deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Category = model<ICategory>('Category', CategorySchema);
