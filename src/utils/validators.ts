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

const idSchema = joi.string().length(24).required().messages({
  'string.length': 'Invalid id',
});

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

const categorySchema = joi.object({
  name: joi.string().min(3).max(100).trim().required(),
  description: joi.string().max(255).trim(),
});

const updateCategorySchema = joi
  .object({
    id: joi.string().length(24).required(),
    name: joi.string().min(3).max(100).trim(),
    description: joi.string().max(255).trim(),
  })
  .or('name', 'description');

const listCategorySchema = joi
  .object({
    page: joi.number().integer().min(1).required(),
    limit: joi.number().integer().min(1).required(),
  })
  .with('page', 'limit');

const createProductSchema = joi.object({
  name: joi.string().min(3).max(100).trim().required(),
  description: joi.string().max(255).trim(),
  price: joi.number().min(0).required(),
  quantity: joi.number().min(0),
  category: joi.string().length(24).required().messages({
    'string.length': 'Invalid category id',
  }),
  image: joi.string().uri(),
});

const listProductSchema = joi
  .object({
    page: joi.number().integer().min(1).required(),
    limit: joi.number().integer().min(1).required(),
  })
  .with('page', 'limit');

export {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  idSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  categorySchema,
  listCategorySchema,
  updateCategorySchema,
  createProductSchema,
  listProductSchema,
};
