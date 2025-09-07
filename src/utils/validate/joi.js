const Joi = require("joi");
const { BadRequestError } = require("../handRespones/error.response");
const mongoose = require("mongoose");

const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }
    next();
  };
};

const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }
    next();
  };
};

const objectIdValidator = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId Validation");

// Validation schemas for favorite functionality
const favoriteImageParamsSchema = Joi.object({
  imageId: Joi.number().integer().positive().required().messages({
    'number.base': 'Image ID must be a number',
    'number.integer': 'Image ID must be an integer',
    'number.positive': 'Image ID must be positive',
    'any.required': 'Image ID is required'
  })
});

const favoriteImagesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1'
  }),
  limit: Joi.number().integer().min(1).max(100).optional().default(10).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 100'
  })
});

const bulkFavoriteImagesSchema = Joi.object({
  imageIds: Joi.array()
    .items(Joi.number().integer().positive().messages({
      'number.base': 'Each image ID must be a number',
      'number.integer': 'Each image ID must be an integer',
      'number.positive': 'Each image ID must be positive'
    }))
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.base': 'Image IDs must be an array',
      'array.min': 'At least one image ID is required',
      'array.max': 'Cannot process more than 100 images at once',
      'any.required': 'Image IDs array is required'
    })
});

module.exports = {
  validateSchema,
  validateParams,
  validateQuery,
  objectIdValidator,
  favoriteImageParamsSchema,
  favoriteImagesQuerySchema,
  bulkFavoriteImagesSchema
};