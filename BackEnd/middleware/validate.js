import { validationResult } from 'express-validator';

/**
 * Middleware that checks for validation errors from express-validator.
 * Returns 400 with error details if validation fails.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array().map(e => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};
