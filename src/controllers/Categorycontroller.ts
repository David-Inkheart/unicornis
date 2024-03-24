import { categorySchema, idSchema, listCategorySchema, updateCategorySchema } from '../utils/validators';
import {
  findCategory,
  createCategory,
  getCategoryList,
  findCategoryById,
  updateCategory,
  deleteCategoryById,
} from '../repositories/mongo/operations/db.category';
import { CATEGORY_ALREADY_EXISTS_ERROR, CATEGORY_NOT_FOUND_ERROR } from '../utils/constants/error';
import { CREATE_SUCCESS, DELETE_SUCCESS, FETCH_SUCCESS } from '../utils/constants/message';

class CategoryController {
  static async makeCategory({ name, description }: { name: string; description: string | undefined }) {
    const { error } = categorySchema.validate({ name, description });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const existingCategory = await findCategory({ name });
    if (existingCategory) {
      return {
        success: false,
        error: CATEGORY_ALREADY_EXISTS_ERROR.message,
      };
    }

    const newCategory = await createCategory({ name, description });

    return {
      success: true,
      message: CREATE_SUCCESS,
      data: newCategory,
    };
  }

  // get paginated category list
  static async getCategoryList({ page, limit }: { page: number; limit: number }) {
    const { error } = listCategorySchema.validate({ page, limit });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const categories = await getCategoryList({ page, limit });

    return {
      success: true,
      message: FETCH_SUCCESS,
      data: {
        categories: categories.docs,
        totalCategories: categories.totalDocs,
        limit: categories.limit,
        totalPages: categories.totalPages,
        page: categories.page,
        pagingCounter: categories.pagingCounter,
        hasPrevPage: categories.hasPrevPage,
        hasNextPage: categories.hasNextPage,
        prevPage: categories.prevPage,
        nextPage: categories.nextPage,
      },
    };
  }

  static async getCategoryById(id: string) {
    const { error } = idSchema.validate(id);
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const category = await findCategoryById(id);
    if (!category) {
      return {
        success: false,
        error: CATEGORY_NOT_FOUND_ERROR.message,
      };
    }
    return {
      success: true,
      message: FETCH_SUCCESS,
      data: category,
    };
  }

  static async editCategory(id: string, { name, description }: { name: string; description: string | undefined }) {
    const { error } = updateCategorySchema.validate({ id, name, description });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const existingCategory = await findCategoryById(id);
    if (!existingCategory) {
      return {
        success: false,
        error: CATEGORY_NOT_FOUND_ERROR.message,
      };
    }

    const updatedCategory = await updateCategory(id, { name, description });

    return {
      success: true,
      message: CREATE_SUCCESS,
      data: updatedCategory,
    };
  }

  static async removeCategory(id: string) {
    const { error } = idSchema.validate(id);
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const existingCategory = await findCategoryById(id);
    if (!existingCategory) {
      return {
        success: false,
        error: CATEGORY_NOT_FOUND_ERROR.message,
      };
    }

    await deleteCategoryById(id);

    return {
      success: true,
      message: DELETE_SUCCESS,
    };
  }
}

export default CategoryController;
