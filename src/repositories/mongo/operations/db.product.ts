import mongoose from 'mongoose';
import { Product } from '../../../models/Product';
import { options } from '../../../utils/constants/random';
import { StockLog } from '../../../models/Stocklog';
import { PRODUCT_NOT_ENOUGH_STOCK_ERROR, PRODUCT_NOT_FOUND_ERROR, PRODUCT_OUT_OF_STOCK_ERROR } from '../../../utils/constants/error';
import { PURCHASE_SUCCESS, RESTOCK_SUCCESS } from '../../../utils/constants/message';
import logger from '../../../utils/winston';

export const findProduct = (data: mongoose.FilterQuery<any>) => {
  return Product.findOne(data);
};

export const findProductById = (id: string) => {
  return Product.findById(id).populate('category');
};

// paginated product list with filters
export const getProductList = ({ page, limit, filters }: { page: number; limit: number; filters?: Record<string, any> }) => {
  options.page = page;
  options.limit = limit;

  let query: Record<string, any> = {};
  // Remove null or undefined members from the filters object
  if (filters) {
    query = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined));
  }

  return Product.paginate(query, options);
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

export const restockProductSession = async ({ userId, id, quantity }: { userId: string; id: string; quantity: number }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update the product quantity atomically or throw an error
    // lock on the document until the transaction is committed
    const updatedProduct = await Product.findByIdAndUpdate(id, { $inc: { quantity } }, { new: true, session });
    if (!updatedProduct) {
      throw new Error(PRODUCT_NOT_FOUND_ERROR.message);
    }

    // Create a stock log entry
    const recordedRestock = await StockLog.create(
      [
        {
          product: id,
          user: userId,
          quantity,
          transactionType: 'restocked',
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    logger.info('Restock transaction committed successfully');

    return {
      success: true,
      message: RESTOCK_SUCCESS,
      data: {
        ...updatedProduct?.toObject(),
        price: updatedProduct?.price.toString(),
        restockLog: recordedRestock,
      },
    };
  } catch (error: any) {
    logger.error(`Error during restock transaction: ${error.message}`);

    // Abort the transaction on error and end the session
    await session.abortTransaction();
    session.endSession();

    return {
      success: false,
      error: error.message,
    };
  }
};

export const purchaseProductSession = async ({ userId, id, quantity }: { userId: string; id: string; quantity: number }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const product = await Product.findById(id).session(session);
    if (!product) {
      throw new Error(PRODUCT_NOT_FOUND_ERROR.message);
    }

    if (product.quantity === 0) {
      throw new Error(PRODUCT_OUT_OF_STOCK_ERROR.message);
    }

    if (product.quantity < quantity) {
      throw new Error(PRODUCT_NOT_ENOUGH_STOCK_ERROR.message);
    }

    // lock on the document until the transaction is committed
    const updatedProduct = await Product.findByIdAndUpdate(id, { $inc: { quantity: -quantity } }, { new: true, session });
    if (!updatedProduct) {
      throw new Error(PRODUCT_NOT_FOUND_ERROR.message);
    }

    // Create a stock log entry
    const recordedPurchase = await StockLog.create(
      [
        {
          product: id,
          user: userId,
          quantity,
          transactionType: 'sold',
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    logger.info('Purchase transaction committed successfully');

    return {
      success: true,
      message: PURCHASE_SUCCESS,
      data: {
        ...updatedProduct?.toObject(),
        price: updatedProduct?.price.toString(),
        purchaseLog: recordedPurchase,
      },
    };
  } catch (error: any) {
    logger.error(`Error during purchase transaction: ${error.message}`);

    // Abort the transaction on error and end the session
    await session.abortTransaction();
    session.endSession();

    return {
      success: false,
      error: error.message,
    };
  }
};

// export const getProductList = () => {
//   return Product.find({ active: true });
// };

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
