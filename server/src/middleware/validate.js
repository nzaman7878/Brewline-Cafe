import { ZodError } from 'zod';

/**
 * Middleware to validate request against a Zod schema
 * @param {import('zod').ZodSchema} schema
 */
export const validate = (schema) => async (req, res, next) => {
  try {
    const validData = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Replace request data with parsed (and stripped) data
    req.body = validData.body;
    req.query = validData.query;
    req.params = validData.params;
    
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }
    next(error);
  }
};
