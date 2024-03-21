import jwt from 'jsonwebtoken';
import { hashPassword, comparePasswords } from '../utils/passwordService';
import { registerSchema, loginSchema } from '../utils/validators';
import { createUser, findUser } from '../repositories/mongo/operations/db.user';
import { EMAIL_PASSWORD_INCORRECT_ERROR, USER_ALREADY_EXISTS_ERROR } from '../utils/constants/error';
import { LOGIN_SUCCESS, REGISTER_SUCCESS } from '../utils/constants/message';

class AuthController {
  static async register({
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
  }) {
    // validate user input
    const { error } = registerSchema.validate({ firstName, lastName, phoneNumber, email, password });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const existingUser = await findUser({ email });
    if (existingUser) {
      return {
        success: false,
        error: USER_ALREADY_EXISTS_ERROR.message,
      };
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await createUser({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    // generate jwt Token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    return {
      success: true,
      message: REGISTER_SUCCESS,
      token,
    };
  }

  static async login({ email, password }: { email: string; password: string }) {
    // validate user input
    const { error } = loginSchema.validate({ email, password });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const user = await findUser({ email });
    if (!user) {
      return {
        success: false,
        error: EMAIL_PASSWORD_INCORRECT_ERROR.message,
      };
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return {
        success: false,
        error: EMAIL_PASSWORD_INCORRECT_ERROR.message,
      };
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    return {
      success: true,
      message: LOGIN_SUCCESS,
      token,
    };
  }
}

export default AuthController;
