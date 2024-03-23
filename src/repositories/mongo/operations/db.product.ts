import mongoose from 'mongoose';
import { Product } from '../../../models/Product';

export const findProduct = (data: mongoose.FilterQuery<any>) => {
  return Product.findOne(data);
};

export const findProductById = (id: string) => {
  return Product.findById(id);
};

// export const getProductList = () => {
//   return Product.find({ active: true });
// };

export const getProductList = () => {
  return Product.find();
};

export const createProduct = (data: mongoose.FilterQuery<any>) => {
  const product = new Product(data);
  return product.save();
};

export const updateProduct = (id: string, data: mongoose.UpdateQuery<any>) => {
  return Product.findByIdAndUpdate(
    {
      _id: id,
    },
    data,
    {
      new: true,
    },
  );
};

export const deleteProductById = (id: string) => {
  return Product.findByIdAndDelete(id);
};

// export const softDeleteProductById = (id: string) => {
//   return Product.findByIdAndUpdate(
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
