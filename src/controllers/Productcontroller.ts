import { findCategoryById } from '../repositories/mongo/operations/db.category';
import {
  createProduct,
  deleteProductById,
  findProduct,
  findProductById,
  getProductList,
  restockProductSession,
  updateProduct,
} from '../repositories/mongo/operations/db.product';
import { CATEGORY_NOT_FOUND_ERROR, PRODUCT_ALREADY_EXISTS_ERROR, PRODUCT_NOT_FOUND_ERROR } from '../utils/constants/error';
import { CREATE_SUCCESS, DELETE_SUCCESS, FETCH_SUCCESS, UPDATE_SUCCESS } from '../utils/constants/message';
import { createProductSchema, idSchema, listProductSchema, outOfStockSchema, restockSchema, updateProductSchema } from '../utils/validators';

class ProductController {
  static async makeProduct({
    name,
    description,
    price,
    quantity,
    category,
    image,
  }: {
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    image: string;
  }) {
    const { error } = createProductSchema.validate({
      name,
      description,
      price,
      quantity,
      category,
      image,
    });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const existingProduct = await findProduct({ name, category });
    if (existingProduct) {
      return {
        success: false,
        error: PRODUCT_ALREADY_EXISTS_ERROR.message,
      };
    }

    const existingCategory = await findCategoryById(category);
    if (!existingCategory) {
      return {
        success: false,
        error: CATEGORY_NOT_FOUND_ERROR.message,
      };
    }

    const product = await createProduct({
      name,
      description,
      price,
      quantity,
      category,
      image,
    });

    return {
      success: true,
      message: CREATE_SUCCESS,
      data: {
        ...product.toObject(),
        price: product.price.toString(),
      },
    };
  }

  static async getProductList({
    page,
    limit,
    categoryId,
    minPrice,
    maxPrice,
  }: {
    page: number;
    limit: number;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const { error } = listProductSchema.validate({ page, limit, categoryId, minPrice, maxPrice });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const products = await getProductList({ page, limit, filters: { category: categoryId, price: { $gte: minPrice, $lte: maxPrice } } });

    const productsWithPrice = products.docs.map((product) => ({
      ...product.toObject(),
      price: product.price.toString(),
    }));

    return {
      success: true,
      message: FETCH_SUCCESS,
      data: {
        products: productsWithPrice,
        totalProducts: products.totalDocs,
        limit: products.limit,
        totalPages: products.totalPages,
        page: products.page,
        pagingCounter: products.pagingCounter,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
      },
    };
  }

  static async getProductById(id: string) {
    const { error } = idSchema.validate(id);
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const product = await findProductById(id);
    if (!product) {
      return {
        success: false,
        error: PRODUCT_NOT_FOUND_ERROR.message,
      };
    }

    return {
      success: true,
      message: FETCH_SUCCESS,
      data: {
        ...product.toObject(),
        price: product.price.toString(),
      },
    };
  }

  static async removeProduct(id: string) {
    const { error } = idSchema.validate(id);
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const product = await findProduct({ _id: id });
    if (!product) {
      return {
        success: false,
        error: PRODUCT_NOT_FOUND_ERROR.message,
      };
    }

    await deleteProductById(id);

    return {
      success: true,
      message: DELETE_SUCCESS,
    };
  }

  static async editProduct(
    id: string,
    { name, description, price, category, image }: { name?: string; description?: string; price?: number; category?: string; image?: string },
  ) {
    const { error } = updateProductSchema.validate({ id, name, description, price, category, image });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const product = await findProduct({ _id: id });
    if (!product) {
      return {
        success: false,
        error: PRODUCT_NOT_FOUND_ERROR.message,
      };
    }

    if (category && category !== product.category) {
      const existingCategory = await findCategoryById(category);
      if (!existingCategory) {
        return {
          success: false,
          error: CATEGORY_NOT_FOUND_ERROR.message,
        };
      }
    }

    const updatedProduct = await updateProduct(id, { name, description, price, category, image });

    return {
      success: true,
      message: UPDATE_SUCCESS,
      data: {
        ...updatedProduct?.toObject(),
        price: updatedProduct?.price.toString(),
      },
    };
  }

  static async getOutOfStockProducts({ page, limit, quantity }: { page: number; limit: number; quantity: number }) {
    const { error } = outOfStockSchema.validate({ page, limit, quantity });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const products = await getProductList({ page, limit, filters: { quantity: { $lte: quantity } } });

    const productsWithPrice = products.docs.map((product) => ({
      ...product.toObject(),
      price: product.price.toString(),
    }));

    return {
      success: true,
      message: FETCH_SUCCESS,
      data: {
        products: productsWithPrice,
        totalProducts: products.totalDocs,
        limit: products.limit,
        totalPages: products.totalPages,
        page: products.page,
        pagingCounter: products.pagingCounter,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
      },
    };
  }

  static async restockProduct({ id, quantity }: { id: string; quantity: number }) {
    const { error } = restockSchema.validate({ id, quantity });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const restockedProduct = await restockProductSession({ id, quantity });

    return restockedProduct;
  }
}

export default ProductController;
