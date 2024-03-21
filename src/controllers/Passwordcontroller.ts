import { findUser, findUserbyId, updateUser } from '../repositories/mongo/operations/db.user';
import { hashPassword, comparePasswords } from '../utils/passwordService';
import { UserId } from '../types/custom';
import { changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from '../utils/validators';
import logger from '../utils/winston';
import {
  COULD_NOT_CACHE_ERROR,
  COULD_NOT_CHANGE_PASSWORD_ERROR,
  CURRENT_PASSWORD_INCORRECT_ERROR,
  INVALID_EXPIRED_TOKEN_ERROR,
  NEW_OLD_PASSWORD_SAME_ERROR,
  USER_NOT_FOUND_ERROR,
} from '../utils/constants/error';
import { PASSWORD_CHANGED_SUCCESS, PASSWORD_RESET_SUCCESS, TOKEN_SENT_SUCCESS } from '../utils/constants/message';
import { deleteResetToken, getResetToken, storeResetToken } from '../repositories/redis/access/redis.user';

class PasswordController {
  static async changePassword({ userId, currentPassword, newPassword }: { userId: UserId; currentPassword: string; newPassword: string }) {
    try {
      // validate the request body
      const { error } = changePasswordSchema.validate({ currentPassword, newPassword });
      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      const existingUser = await findUserbyId(userId);

      const isPasswordValid = await comparePasswords(currentPassword, existingUser!.password);
      if (!isPasswordValid) {
        return {
          success: false,
          error: CURRENT_PASSWORD_INCORRECT_ERROR.message,
        };
      }

      const hashedPassword = await hashPassword(newPassword);
      await updateUser(userId, { password: hashedPassword });

      return {
        success: true,
        message: PASSWORD_CHANGED_SUCCESS,
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        success: false,
        error: COULD_NOT_CHANGE_PASSWORD_ERROR.message,
      };
    }
  }

  static async resetPassword(email: string) {
    // validate the user input
    const { error } = forgotPasswordSchema.validate({ email });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const existingUser = await findUser({ email });
    if (existingUser) {
      // generate a 5-digit code
      const passwordResetToken = Math.floor(10000 + Math.random() * 90000);

      // save the code to the Redis store with an expiration of 10 minutes
      const key = `password-reset-token-${existingUser.id}`;
      try {
        await storeResetToken(key, passwordResetToken.toString());
      } catch (err) {
        return {
          success: false,
          error: COULD_NOT_CACHE_ERROR.message,
        };
      }
      // Ideally, send the code to the user's email
      logger.info('passwordResetToken: ', passwordResetToken);
    }

    return {
      success: true,
      message: TOKEN_SENT_SUCCESS,
    };
  }

  static async confirmResetPassword(email: string, code: string, newPassword: string) {
    // validate the user input
    const { error } = resetPasswordSchema.validate({ email, code, newPassword });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const existingUser = await findUser({ email });
    if (!existingUser) {
      return {
        success: false,
        error: USER_NOT_FOUND_ERROR.message,
      };
    }

    const isPasswordValid = await comparePasswords(newPassword, existingUser.password);
    if (isPasswordValid) {
      return {
        success: false,
        error: NEW_OLD_PASSWORD_SAME_ERROR.message,
      };
    }
    // check if the code is valid
    const key = `password-reset-token-${existingUser.id}`;
    const cachedCode = await getResetToken(key);
    if (!cachedCode) {
      return {
        success: false,
        error: INVALID_EXPIRED_TOKEN_ERROR.message,
      };
    }
    if (cachedCode !== code) {
      return {
        success: false,
        error: INVALID_EXPIRED_TOKEN_ERROR.message,
      };
    }

    const hashedPassword = await hashPassword(newPassword);

    await updateUser(existingUser.id, { password: hashedPassword });

    await deleteResetToken(key);

    return {
      success: true,
      message: PASSWORD_RESET_SUCCESS,
    };
  }
}

export default PasswordController;
