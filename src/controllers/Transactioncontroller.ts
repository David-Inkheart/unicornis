import { startOfDay, endOfDay } from 'date-fns';
import { getStockLogList } from '../repositories/mongo/operations/db.stocklog';
import { inventoryListSchema } from '../utils/validators';
import { FETCH_SUCCESS } from '../utils/constants/message';

class TransactionController {
  static async getTransactionLogs({
    page,
    limit,
    productId,
    transactionType,
    from,
    to,
  }: {
    page: number;
    limit: number;
    productId?: string;
    transactionType?: string;
    from?: string;
    to?: string;
  }) {
    const { error } = inventoryListSchema.validate({
      page,
      limit,
      productId,
      transactionType,
      from,
      to,
    });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const StartDate = from ? startOfDay(new Date(from)) : undefined;
    const EndDate = to ? endOfDay(new Date(to)) : undefined;

    const transactionLogs = await getStockLogList({
      page,
      limit,
      filters: {
        product: productId,
        transactionType,
        ...(StartDate && { createdAt: { $gte: StartDate } }),
        ...(EndDate && { createdAt: { $lte: EndDate } }),
        ...(StartDate && EndDate && { createdAt: { $gte: StartDate, $lte: EndDate } }),
      },
    });

    return {
      success: true,
      message: FETCH_SUCCESS,
      data: {
        transactionLogs: transactionLogs.docs,
        totalTransactionLogs: transactionLogs.totalDocs,
        limit: transactionLogs.limit,
        totalPages: transactionLogs.totalPages,
        page: transactionLogs.page,
        pagingCounter: transactionLogs.pagingCounter,
        hasPrevPage: transactionLogs.hasPrevPage,
        hasNextPage: transactionLogs.hasNextPage,
        prevPage: transactionLogs.prevPage,
        nextPage: transactionLogs.nextPage,
      },
    };
  }
}

export default TransactionController;
