const BAD_REQUEST_ERROR = {
  code: 400,
  message: 'Bad request',
};

const UNAUTHORIZED_ERROR = {
  code: 401,
  message: 'Unauthorized',
};

const FORBIDDEN_ERROR = {
  code: 403,
  message: 'Forbidden',
};

const NOT_FOUND_ERROR = {
  code: 404,
  message: 'Resource not found',
};

const CONFLICT_ERROR = {
  code: 409,
  message: 'Conflict. This resource already exists',
};

const INTERNAL_SERVER_ERROR = {
  code: 500,
  message: 'Internal server error',
};

const DUPLICATE_ERROR = {
  code: 409,
  message: 'Duplicate action: request already sent',
};

const USER_NOT_FOUND_ERROR = {
  code: 404,
  message: 'User not found.',
};

const UNPAID_BOOKING_FEE_ERROR = {
  code: 400,
  message: 'Booking fee must be paid before full payment can be approved',
};

const USER_ALREADY_EXISTS_ERROR = {
  code: 409,
  message: 'User with same email or phoneNumber already exists',
};

const EMAIL_PASSWORD_INCORRECT_ERROR = {
  code: 401,
  message: 'Email/password mismatch',
};

const CURRENT_PASSWORD_INCORRECT_ERROR = {
  code: 401,
  message: 'Current password is incorrect',
};

const COULD_NOT_CHANGE_PASSWORD_ERROR = {
  code: 500,
  message: 'Could not change password',
};

const COULD_NOT_CACHE_ERROR = {
  code: 500,
  message: 'Could not cache resource',
};

const NEW_OLD_PASSWORD_SAME_ERROR = {
  code: 400,
  message: 'New password cannot be the same as the current password',
};

const INVALID_EXPIRED_TOKEN_ERROR = {
  code: 400,
  message: 'The code is invalid or has expired',
};

const CATEGORY_ALREADY_EXISTS_ERROR = {
  code: 409,
  message: 'Category already exists',
};

const CATEGORY_NOT_FOUND_ERROR = {
  code: 404,
  message: 'Category not found',
};

const PRODUCT_NOT_FOUND_ERROR = {
  code: 404,
  message: 'Product not found',
};

const OBJECTID_CAST_ERROR = {
  code: 400,
  message: 'Invalid ObjectId',
};

const PRODUCT_ALREADY_EXISTS_ERROR = {
  code: 409,
  message: 'Product already exists',
};

const INVALID_OBJECTID_ERROR = 'Cast to ObjectId failed';

export {
  BAD_REQUEST_ERROR,
  UNAUTHORIZED_ERROR,
  FORBIDDEN_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
  INTERNAL_SERVER_ERROR,
  DUPLICATE_ERROR,
  UNPAID_BOOKING_FEE_ERROR,
  USER_NOT_FOUND_ERROR,
  USER_ALREADY_EXISTS_ERROR,
  EMAIL_PASSWORD_INCORRECT_ERROR,
  CURRENT_PASSWORD_INCORRECT_ERROR,
  COULD_NOT_CHANGE_PASSWORD_ERROR,
  COULD_NOT_CACHE_ERROR,
  NEW_OLD_PASSWORD_SAME_ERROR,
  INVALID_EXPIRED_TOKEN_ERROR,
  CATEGORY_ALREADY_EXISTS_ERROR,
  CATEGORY_NOT_FOUND_ERROR,
  OBJECTID_CAST_ERROR,
  INVALID_OBJECTID_ERROR,
  PRODUCT_ALREADY_EXISTS_ERROR,
  PRODUCT_NOT_FOUND_ERROR,
};
