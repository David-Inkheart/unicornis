import { RequestHandler } from 'express';
import { INTERNAL_SERVER_ERROR } from '../../utils/constants/error';
import AppController from '../../controllers/AppController';

export const getHomeHandler: RequestHandler = async (_, res) => {
  try {
    const response = await AppController.getHome();

    return res.json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: INTERNAL_SERVER_ERROR.message,
    });
  }
};
