import joi from 'joi';

const registerSchema = joi.object({
  firstName: joi.string().min(3).max(20).trim().alphanum().required(),
  lastName: joi.string().min(3).max(20).trim().alphanum().required(),
  phoneNumber: joi.string().min(10).max(15).trim().required(),
  email: joi.string().email().trim().lowercase().required(),
  password: joi.string().min(8).trim().required(),
});

const loginSchema = joi.object({
  email: joi.string().email().trim().lowercase().required(),
  password: joi.string().min(8).trim().required(),
});

const idSchema = joi.number().integer().min(1).required();

const changePasswordSchema = joi.object({
  currentPassword: joi.string().min(8).required(),
  newPassword: joi
    .string()
    .min(8)
    .trim()
    .required()
    .disallow(joi.ref('currentPassword'))
    .messages({ 'any.invalid': 'New password must be different from old password' }),
});

const forgotPasswordSchema = joi.object({
  email: joi.string().email().lowercase().trim().required(),
});

const resetPasswordSchema = joi.object({
  email: joi.string().email().lowercase().trim().required(),
  newPassword: joi.string().min(8).required(),
  code: joi.string().required().length(5),
});

export { loginSchema, registerSchema, changePasswordSchema, idSchema, forgotPasswordSchema, resetPasswordSchema };
