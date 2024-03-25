import { RequestHandler } from 'express';
import TransactionController from '../../controllers/Transactioncontroller';
import logger from '../../utils/winston';
import { BAD_REQUEST_ERROR, INTERNAL_SERVER_ERROR } from '../../utils/constants/error';

export const getTransactionLogsHandler: RequestHandler = async (req, res) => {
  try {
    const { page, limit, productId, transactionType, from, to } = req.query;

    const Page = page ? Number(page) : 1;
    const Limit = limit ? Number(limit) : 10;

    const response = await TransactionController.getTransactionLogs({
      page: Page,
      limit: Limit,
      productId: productId as string,
      transactionType: transactionType as string,
      from: from as string,
      to: to as string,
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
