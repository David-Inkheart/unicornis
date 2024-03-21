import { faker } from '@faker-js/faker';
import { findUser, updateUser } from '../../repositories/mongo/operations/db.user';
import { getResetToken, storeResetToken } from '../../repositories/redis/access/redis.user';
import { hashPassword, comparePasswords } from '../../utils/passwordService';
import { changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from '../../utils/validators';

import PasswordController from '../PasswordController';
import {
  COULD_NOT_CACHE_ERROR,
  COULD_NOT_CHANGE_PASSWORD_ERROR,
  CURRENT_PASSWORD_INCORRECT_ERROR,
  INVALID_EXPIRED_TOKEN_ERROR,
  NEW_OLD_PASSWORD_SAME_ERROR,
  USER_NOT_FOUND_ERROR,
} from '../../utils/constants/error';
import { PASSWORD_CHANGED_SUCCESS, PASSWORD_RESET_SUCCESS, TOKEN_SENT_SUCCESS } from '../../utils/constants/message';

jest.mock('../../repositories/mongo/operations/db.user');
jest.mock('../../repositories/redis/access/redis.user');
jest.mock('../../utils/passwordService');
jest.mock('../../utils/validators');

describe('PasswordController', () => {
  const userId = faker.number.int();

  const user1 = {
    id: userId,
    password: faker.internet.password(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phoneNumber: faker.phone.number(),
    createdAt: faker.date.past(),
  };

  describe('changePassword', () => {
    it('should return an error if password is invalid', async () => {
      const error = new Error(faker.lorem.sentence());
      (changePasswordSchema.validate as jest.Mock).mockReturnValue({ error });

      const result = await PasswordController.changePassword({
        userId,
        currentPassword: faker.internet.password(),
        newPassword: faker.internet.password(),
      });

      expect(result).toEqual({
        success: false,
        error: error.message,
      });
    });

    it('should return an error if user does not exist', async () => {
      (changePasswordSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (findUser as jest.Mock).mockResolvedValue(undefined);

      const result = await PasswordController.changePassword({
        userId,
        currentPassword: faker.internet.password(),
        newPassword: faker.internet.password(),
      });

      expect(result).toEqual({
        success: false,
        error: COULD_NOT_CHANGE_PASSWORD_ERROR.message,
      });
    });

    it.skip('should return an error if current password is invalid', async () => {
      (changePasswordSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (findUser as jest.Mock).mockResolvedValue(user1);
      (comparePasswords as jest.Mock).mockResolvedValue(false);

      const result = await PasswordController.changePassword({
        userId,
        currentPassword: faker.internet.password(),
        newPassword: faker.internet.password(),
      });

      expect(result).toEqual({
        success: false,
        error: CURRENT_PASSWORD_INCORRECT_ERROR.message,
      });
    });

    it('should return an error if password could not be hashed', async () => {
      (changePasswordSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (findUser as jest.Mock).mockResolvedValue(user1);
      (comparePasswords as jest.Mock).mockResolvedValue(true);
      (hashPassword as jest.Mock).mockRejectedValue(new Error(faker.lorem.sentence()));

      const result = await PasswordController.changePassword({
        userId,
        currentPassword: faker.internet.password(),
        newPassword: faker.internet.password(),
      });

      expect(result).toEqual({
        success: false,
        error: COULD_NOT_CHANGE_PASSWORD_ERROR.message,
      });
    });

    it('should return an error if password could not be updated', async () => {
      (changePasswordSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (findUser as jest.Mock).mockResolvedValue(user1);
      (comparePasswords as jest.Mock).mockResolvedValue(true);
      (hashPassword as jest.Mock).mockResolvedValue(faker.internet.password());
      (updateUser as jest.Mock).mockRejectedValue(new Error(faker.lorem.sentence()));

      const result = await PasswordController.changePassword({
        userId,
        currentPassword: faker.internet.password(),
        newPassword: faker.internet.password(),
      });

      expect(result).toEqual({
        success: false,
        error: COULD_NOT_CHANGE_PASSWORD_ERROR.message,
      });
    });

    it.skip('should return a success message if password was changed successfully', async () => {
      (changePasswordSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (findUser as jest.Mock).mockResolvedValue(user1);
      (comparePasswords as jest.Mock).mockResolvedValue(true);
      (hashPassword as jest.Mock).mockResolvedValue(faker.internet.password());
      (updateUser as jest.Mock).mockResolvedValue(undefined);

      const result = await PasswordController.changePassword({
        userId,
        currentPassword: faker.internet.password(),
        newPassword: faker.internet.password(),
      });

      expect(result).toEqual({
        success: true,
        message: PASSWORD_CHANGED_SUCCESS,
      });
    });
  });

  describe('resetPassword', () => {
    it('should return an error if email is invalid', async () => {
      const error = new Error(faker.lorem.sentence());
      (forgotPasswordSchema.validate as jest.Mock).mockReturnValue({ error });

      const result = await PasswordController.resetPassword(faker.internet.email());

      expect(result).toEqual({
        success: false,
        error: error.message,
      });
    });

    it('should still return success even if user does not exist', async () => {
      (forgotPasswordSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (findUser as jest.Mock).mockResolvedValue(undefined);

      const result = await PasswordController.resetPassword(faker.internet.email());

      expect(result).toEqual({
        success: true,
        message: TOKEN_SENT_SUCCESS,
      });
    });

    it('should return an error if token could not be stored', async () => {
      (forgotPasswordSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (findUser as jest.Mock).mockResolvedValue(user1);
      (storeResetToken as jest.Mock).mockRejectedValue(new Error(faker.lorem.sentence()));

      const result = await PasswordController.resetPassword(faker.internet.email());

      expect(result).toEqual({
        success: false,
        error: COULD_NOT_CACHE_ERROR.message,
      });
    });

    it('should return a success message if email was sent successfully', async () => {
      (forgotPasswordSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (findUser as jest.Mock).mockResolvedValue(user1);
      (storeResetToken as jest.Mock).mockResolvedValue(undefined);

      const result = await PasswordController.resetPassword(faker.internet.email());

      expect(result).toEqual({
        success: true,
        message: TOKEN_SENT_SUCCESS,
      });
    });
  });

  describe('confirmResetPassword', () => {
    it('should return an error if email is invalid', async () => {
      const email = faker.internet.email();
      const code = faker.number.int().toFixed(5);
      const newPassword = faker.internet.password();

      const error = new Error(faker.lorem.sentence());
      (resetPasswordSchema.validate as jest.Mock).mockReturnValue({ error });
      const result = await PasswordController.confirmResetPassword(email, code, newPassword);

      expect(result).toEqual({
        success: false,
        error: error.message,
      });
    });

    it('should return an error if code is invalid', async () => {
      const email = faker.internet.email();
      const code = faker.number.int().toFixed(7);
      const newPassword = faker.internet.password();

      (resetPasswordSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (findUser as jest.Mock).mockResolvedValue(user1);
      (getResetToken as jest.Mock).mockResolvedValue(undefined);

      const result = await PasswordController.confirmResetPassword(email, code, newPassword);

      expect(result).toEqual({
        success: false,
        error: INVALID_EXPIRED_TOKEN_ERROR.message,
      });
    });

    it('should return an error if code is incorrect', async () => {
      const email = faker.internet.email();
      const code = faker.number.int().toFixed(5);
      const newPassword = faker.internet.password();

      (resetPasswordSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (findUser as jest.Mock).mockResolvedValue(user1);
      (getResetToken as jest.Mock).mockResolvedValue(faker.number.int().toFixed(5));

      const result = await PasswordController.confirmResetPassword(email, code, newPassword);

      expect(result).toEqual({
        success: false,
        error: INVALID_EXPIRED_TOKEN_ERROR.message,
      });
    });

    it('should return an error if user does not exist', async () => {
      const email = faker.internet.email();
      const code = faker.number.int().toFixed(5);
      const newPassword = faker.internet.password();

      (resetPasswordSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (findUser as jest.Mock).mockResolvedValue(undefined);

      const result = await PasswordController.confirmResetPassword(email, code, newPassword);

      expect(result).toEqual({
        success: false,
        error: USER_NOT_FOUND_ERROR.message,
      });
    });

    it('should return an error if the new password matches the old password', async () => {
      const email = faker.internet.email();
      const code = faker.number.int().toFixed(5);
      const newPassword = user1.password;

      (resetPasswordSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (findUser as jest.Mock).mockResolvedValue(user1);

      (comparePasswords as jest.Mock).mockResolvedValue(true);

      const result = await PasswordController.confirmResetPassword(email, code, newPassword);

      expect(result).toEqual({
        success: false,
        error: NEW_OLD_PASSWORD_SAME_ERROR.message,
      });
    });

    it('should return a success message if password was reset successfully', async () => {
      const email = faker.internet.email();
      const code = faker.number.int().toFixed(5);
      const newPassword = faker.internet.password();

      (resetPasswordSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (findUser as jest.Mock).mockResolvedValue(user1);
      (getResetToken as jest.Mock).mockResolvedValue(code);
      (hashPassword as jest.Mock).mockResolvedValue(faker.internet.password());
      (updateUser as jest.Mock).mockResolvedValue(undefined);

      const result = await PasswordController.confirmResetPassword(email, code, newPassword);

      expect(result).toEqual({
        success: true,
        message: PASSWORD_RESET_SUCCESS,
      });
    });
  });
});
