import { RequestHandler } from 'express';
import CategoryController from '../../controllers/Categorycontroller';
import logger from '../../utils/winston';
import {
  BAD_REQUEST_ERROR,
  CATEGORY_ALREADY_EXISTS_ERROR,
  CATEGORY_NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  INVALID_OBJECTID_ERROR,
} from '../../utils/constants/error';

export const createCategoryHandler: RequestHandler = async (req, res) => {
  try {
    const { name, description } = req.body;

    const response = await CategoryController.makeCategory({ name, description });

    if (!response.success) {
      if (response.error === CATEGORY_ALREADY_EXISTS_ERROR.message) {
        return res.status(CATEGORY_ALREADY_EXISTS_ERROR.code).json({
          success: false,
          error: response.error,
        });
      }
      return res.status(BAD_REQUEST_ERROR.code).json({
        success: false,
        error: response.error,
      });
    }

    return res.json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      success: false,
      error: INTERNAL_SERVER_ERROR.message,
    });
  }
};

export const listCategoryHandler: RequestHandler = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const response = await CategoryController.getCategoryList({ page: Number(page), limit: Number(limit) });

    if (!response.success) {
      return res.status(BAD_REQUEST_ERROR.code).json({
        success: false,
        error: response.error,
      });
    }

    return res.json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      success: false,
      error: INTERNAL_SERVER_ERROR.message,
    });
  }
};

export const getCategoryByIdHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await CategoryController.getCategoryById(id);

    if (!response.success) {
      if (response.error === CATEGORY_NOT_FOUND_ERROR.message) {
        return res.status(CATEGORY_NOT_FOUND_ERROR.code).json({
          success: false,
          error: response.error,
        });
      }
      return res.status(BAD_REQUEST_ERROR.code).json({
        success: false,
        error: response.error,
      });
    }

    return res.json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  } catch (err: any) {
    logger.error(err.message);
    if (err.message.includes(INVALID_OBJECTID_ERROR)) {
      return res.status(BAD_REQUEST_ERROR.code).json({
        success: false,
        error: BAD_REQUEST_ERROR.message,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      success: false,
      error: INTERNAL_SERVER_ERROR.message,
    });
  }
};

export const editCategoryHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const response = await CategoryController.editCategory(id, { name, description });

    if (!response.success) {
      if (response.error === CATEGORY_NOT_FOUND_ERROR.message) {
        return res.status(CATEGORY_NOT_FOUND_ERROR.code).json({
          success: false,
          error: response.error,
        });
      }
      return res.status(BAD_REQUEST_ERROR.code).json({
        success: false,
        error: response.error,
      });
    }

    return res.json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  } catch (err: any) {
    logger.error(err.message);
    if (err.message.includes(INVALID_OBJECTID_ERROR)) {
      return res.status(BAD_REQUEST_ERROR.code).json({
        success: false,
        error: BAD_REQUEST_ERROR.message,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      success: false,
      error: INTERNAL_SERVER_ERROR.message,
    });
  }
};

export const removeCategoryHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await CategoryController.removeCategory(id);

    if (!response.success) {
      if (response.error === CATEGORY_NOT_FOUND_ERROR.message) {
        return res.status(CATEGORY_NOT_FOUND_ERROR.code).json({
          success: false,
          error: response.error,
        });
      }
      return res.status(BAD_REQUEST_ERROR.code).json({
        success: false,
        error: response.error,
      });
    }

    return res.json({
      success: response.success,
      message: response.message,
    });
  } catch (err: any) {
    logger.error(err.message);
    if (err.message.includes(INVALID_OBJECTID_ERROR)) {
      return res.status(BAD_REQUEST_ERROR.code).json({
        success: false,
        error: BAD_REQUEST_ERROR.message,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      success: false,
      error: INTERNAL_SERVER_ERROR.message,
    });
  }
};
