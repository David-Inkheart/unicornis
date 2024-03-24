import { RequestHandler } from 'express';
import ProductController from '../../controllers/Productcontroller';
import logger from '../../utils/winston';
import {
  BAD_REQUEST_ERROR,
  CATEGORY_ALREADY_EXISTS_ERROR,
  CATEGORY_NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  INVALID_OBJECTID_ERROR,
  PRODUCT_NOT_FOUND_ERROR,
} from '../../utils/constants/error';

export const createProductHandler: RequestHandler = async (req, res) => {
  try {
    const category = req.params.categoryId;
    const { name, description, price, quantity, image } = req.body;

    const response = await ProductController.makeProduct({
      name,
      description,
      price,
      quantity,
      category,
      image,
    });

    if (!response.success) {
      if (response.error === CATEGORY_ALREADY_EXISTS_ERROR.message) {
        return res.status(CATEGORY_ALREADY_EXISTS_ERROR.code).json({
          success: false,
          error: response.error,
        });
      }
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

export const getProductListHandler: RequestHandler = async (req, res) => {
  try {
    const { page, limit, categoryId, minPrice, maxPrice } = req.query;
    const minimum = minPrice || 0;
    const maximum = maxPrice || 10000000000;

    const response = await ProductController.getProductList({
      page: Number(page),
      limit: Number(limit),
      categoryId: categoryId as string,
      minPrice: Number(minimum),
      maxPrice: Number(maximum),
    });

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

export const getProductByIdHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await ProductController.getProductById(id);

    if (!response.success) {
      if (response.error === PRODUCT_NOT_FOUND_ERROR.message) {
        return res.status(PRODUCT_NOT_FOUND_ERROR.code).json({
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

export const removeProductHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await ProductController.removeProduct(id);

    if (!response.success) {
      if (response.error === PRODUCT_NOT_FOUND_ERROR.message) {
        return res.status(PRODUCT_NOT_FOUND_ERROR.code).json({
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

export const editProductHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image } = req.body;

    const response = await ProductController.editProduct(id, {
      name,
      description,
      price,
      category,
      image,
    });

    if (!response.success) {
      if (response.error === PRODUCT_NOT_FOUND_ERROR.message) {
        return res.status(PRODUCT_NOT_FOUND_ERROR.code).json({
          success: false,
          error: response.error,
        });
      }
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

export const outOfStockHandler: RequestHandler = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const quantity = 0;

    const response = await ProductController.getOutOfStockProducts({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      quantity,
    });

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

export const restockProductHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body as { quantity: number };

    const response = await ProductController.restockProduct({ id, quantity });

    if (!response.success) {
      if (response.error === PRODUCT_NOT_FOUND_ERROR.message) {
        return res.status(PRODUCT_NOT_FOUND_ERROR.code).json({
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
