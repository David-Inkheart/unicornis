import { RequestHandler } from 'express';

import { UserId } from '../../types/custom';
import AuthController from '../../controllers/AuthController';
import PasswordController from '../../controllers/PasswordController';
import logger from '../../utils/winston';
import {
  BAD_REQUEST_ERROR,
  COULD_NOT_CACHE_ERROR,
  CURRENT_PASSWORD_INCORRECT_ERROR,
  EMAIL_PASSWORD_INCORRECT_ERROR,
  INTERNAL_SERVER_ERROR,
  INVALID_EXPIRED_TOKEN_ERROR,
  NEW_OLD_PASSWORD_SAME_ERROR,
  USER_ALREADY_EXISTS_ERROR,
  USER_NOT_FOUND_ERROR,
} from '../../utils/constants/error';
import { LOGIN_SUCCESS } from '../../utils/constants/message';

export const loginHandler: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await AuthController.login({ email, password });

    if (!response.success) {
      if (response.error === EMAIL_PASSWORD_INCORRECT_ERROR.message) {
        return res.status(EMAIL_PASSWORD_INCORRECT_ERROR.code).json({
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
      message: LOGIN_SUCCESS,
      data: { token: response.token },
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      success: false,
      error: INTERNAL_SERVER_ERROR.message,
    });
  }
};

export const registerHandler: RequestHandler = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password } = req.body;

    const response = await AuthController.register({ firstName, lastName, phoneNumber, email, password });

    if (!response.success) {
      if (response.error === USER_ALREADY_EXISTS_ERROR.message) {
        return res.status(USER_ALREADY_EXISTS_ERROR.code).json({
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
      data: { token: response.token },
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      success: false,
      error: INTERNAL_SERVER_ERROR.message,
    });
  }
};

export const changePasswordHandler: RequestHandler = async (req, res) => {
  try {
    const userId = req.userId as UserId;
    const { currentPassword, newPassword } = req.body;

    const response = await PasswordController.changePassword({
      userId,
      currentPassword,
      newPassword,
    });

    if (!response.success) {
      if (response.error === CURRENT_PASSWORD_INCORRECT_ERROR.message) {
        return res.status(CURRENT_PASSWORD_INCORRECT_ERROR.code).json({
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
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      success: false,
      error: INTERNAL_SERVER_ERROR.message,
    });
  }
};

export const resetPasswordHandler: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    const response = await PasswordController.resetPassword(email);

    if (!response.success) {
      if (response.error === COULD_NOT_CACHE_ERROR.message) {
        return res.status(COULD_NOT_CACHE_ERROR.code).json({
          success: false,
          error: response.error,
        });
      }
      return res.status(400).json({
        success: false,
        error: response.error,
      });
    }

    return res.json({
      success: response.success,
      message: response.message,
    });
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR.code).json({
      success: false,
      error: INTERNAL_SERVER_ERROR.message,
    });
  }
};

export const confirmResetPasswordHandler: RequestHandler = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const response = await PasswordController.confirmResetPassword(email, code, newPassword);

    if (!response.success) {
      if (response.error === USER_NOT_FOUND_ERROR.message) {
        return res.status(USER_NOT_FOUND_ERROR.code).json({
          success: false,
          error: response.error,
        });
      }
      if (response.error === NEW_OLD_PASSWORD_SAME_ERROR.message) {
        return res.status(NEW_OLD_PASSWORD_SAME_ERROR.code).json({
          success: false,
          error: response.error,
        });
      }
      if (response.error === INVALID_EXPIRED_TOKEN_ERROR.message) {
        return res.status(INVALID_EXPIRED_TOKEN_ERROR.code).json({
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
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: INTERNAL_SERVER_ERROR.message,
    });
  }
};
