import mongoose from 'mongoose';
import { Category } from '../../../models/Category';
import { options } from '../../../utils/constants/random';

export const findCategory = (data: mongoose.FilterQuery<any>) => {
  return Category.findOne(data);
};

export const findCategoryById = (id: string) => {
  return Category.findById(id);
};

// export const getCategoryList = () => {
//   return Category.find({ active: true }).populate('products');
// };

// paginated category list
export const getCategoryList = ({ page, limit }: { page: number; limit: number }) => {
  options.page = page;
  options.limit = limit;
  return Category.paginate({}, options);
};

export const createCategory = (data: mongoose.FilterQuery<any>) => {
  const category = new Category(data);
  return category.save();
};

export const updateCategory = (id: string, data: mongoose.UpdateQuery<any>) => {
  return Category.findByIdAndUpdate(
    {
      _id: id,
    },
    data,
    {
      new: true,
    },
  );
};

export const deleteCategoryById = (id: string) => {
  return Category.findByIdAndDelete(id);
};

// export const softDeleteCategoryById = (id: string) => {
//   return Category.findByIdAndUpdate(
//     {
//       _id: id,
//     },
//     {
//       active: false,
//       deletedAt: new Date(),
//     },
//     {
//       new: true,
//     },
//   );
// };
