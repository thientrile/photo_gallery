const Joi = require("joi");

const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(new BadRequestError(error.details[0].message));
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
module.exports = {
  validateSchema,
  objectIdValidator
};