import { findCategoryById } from '../repositories/mongo/operations/db.category';
import { createProduct, findProduct, getProductList } from '../repositories/mongo/operations/db.product';
import { CATEGORY_NOT_FOUND_ERROR, PRODUCT_ALREADY_EXISTS_ERROR } from '../utils/constants/error';
import { CREATE_SUCCESS, FETCH_SUCCESS } from '../utils/constants/message';
import { createProductSchema, listProductSchema } from '../utils/validators';

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

  // TODO: add more filters to the query
  static async getProductList({ page, limit }: { page: number; limit: number }) {
    const { error } = listProductSchema.validate({ page, limit });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const products = await getProductList({ page, limit });
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
}

export default ProductController;
