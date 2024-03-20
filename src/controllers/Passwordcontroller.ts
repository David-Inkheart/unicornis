import { findUser, findUserbyId, updateUser } from '../repositories/mongo/operations/db.user';
import { hashPassword, comparePasswords } from '../utils/passwordService';
import { UserId } from '../types/custom';
import { changePasswordSchema } from '../utils/validators';

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

      // compare old password with the one in the database
      const isPasswordValid = await comparePasswords(currentPassword, existingUser!.password);

      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Current password is incorrect',
        };
      }

      // hash the password
      const hashedPassword = await hashPassword(newPassword);

      // update the user's password
      await updateUser(userId, { password: hashedPassword });

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: 'Could not change password',
      };
    }
  }
}

export default PasswordController;
