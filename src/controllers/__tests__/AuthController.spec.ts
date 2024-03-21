import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import { hashPassword, comparePasswords } from '../../utils/passwordService';
import { registerSchema, loginSchema } from '../../utils/validators';
import { createUser, findUser, findUserbyId } from '../../repositories/mongo/operations/db.user';

import AuthController from '../AuthController';
import { EMAIL_PASSWORD_INCORRECT_ERROR, USER_ALREADY_EXISTS_ERROR } from '../../utils/constants/error';
import { LOGIN_SUCCESS, REGISTER_SUCCESS } from '../../utils/constants/message';

jest.mock('../../utils/passwordService');
jest.mock('../../utils/validators');
jest.mock('../../repositories/mongo/operations/db.user');

// mocked jwt sign with user id
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockImplementation((payload) => `token-${payload.id}`),
}));

describe('AuthController', () => {
  const user1 = {
    id: faker.number.int(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phoneNumber: faker.phone.number(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  describe('register', () => {
    const registerArgs = {
      firstName: user1.firstName,
      lastName: user1.lastName,
      phoneNumber: user1.phoneNumber,
      email: 'user1.email',
      password: user1.password,
    };

    it('should return an error if the user input is invalid', async () => {
      const error = new Error(faker.lorem.sentence());
      (registerSchema.validate as jest.Mock).mockReturnValue({ error });

      const result = await AuthController.register(registerArgs);

      expect(result).toEqual({
        success: false,
        error: error.message,
      });
    });

    it.skip('should return an error if the user already exists', async () => {
      (registerSchema.validate as jest.Mock).mockReturnValue({});

      (findUserbyId as jest.Mock).mockResolvedValue(user1);

      const result = await AuthController.register(registerArgs);

      expect(result).toEqual({
        success: false,
        error: USER_ALREADY_EXISTS_ERROR.message,
      });
    });

    it('should create a user', async () => {
      (registerSchema.validate as jest.Mock).mockReturnValue({});

      (findUserbyId as jest.Mock).mockResolvedValue(null);

      (hashPassword as jest.Mock).mockResolvedValue(user1.password);

      (createUser as jest.Mock).mockResolvedValue(user1);

      (jwt.sign as jest.Mock).mockReturnValue(`token-${user1.id}`);

      await expect(AuthController.register(registerArgs)).resolves.toEqual({
        success: true,
        message: REGISTER_SUCCESS,
        token: `token-${user1.id}`,
      });
    });
  });

  describe('login', () => {
    const loginArgs = {
      email: user1.email,
      password: user1.password,
    };

    it('should return an error if the user input is invalid', async () => {
      const error = new Error(faker.lorem.sentence());
      (loginSchema.validate as jest.Mock).mockReturnValue({ error });

      const result = await AuthController.login(loginArgs);

      expect(result).toEqual({
        success: false,
        error: error.message,
      });
    });

    it('should return an error if the user does not exist', async () => {
      (loginSchema.validate as jest.Mock).mockReturnValue({});

      (findUser as jest.Mock).mockResolvedValue(null);

      const result = await AuthController.login(loginArgs);

      expect(result).toEqual({
        success: false,
        error: EMAIL_PASSWORD_INCORRECT_ERROR.message,
      });
    });

    it('should return an error if the password is incorrect', async () => {
      (loginSchema.validate as jest.Mock).mockReturnValue({});

      (findUser as jest.Mock).mockResolvedValue(user1);

      (comparePasswords as jest.Mock).mockResolvedValue(false);

      const result = await AuthController.login(loginArgs);

      expect(result).toEqual({
        success: false,
        error: EMAIL_PASSWORD_INCORRECT_ERROR.message,
      });
    });

    it('should return a token if the password is correct', async () => {
      (loginSchema.validate as jest.Mock).mockReturnValue({});

      (findUser as jest.Mock).mockResolvedValue(user1);

      (comparePasswords as jest.Mock).mockResolvedValue(true);

      (jwt.sign as jest.Mock).mockReturnValue(`token-${user1.id}`);

      const result = await AuthController.login(loginArgs);

      expect(result).toEqual({
        success: true,
        message: LOGIN_SUCCESS,
        token: `token-${user1.id}`,
      });
    });
  });
});
