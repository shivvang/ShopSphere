import Joi from "joi";

export const validateAddProduct = (data) => {
  const Schema = Joi.object({
    name: Joi.string().trim().required().messages({
      "string.base": "Name should be a text.",
      "string.empty": "Name should not be empty.",
      "any.required": "Name is required."
    }),
    description: Joi.string().trim().required().messages({
      "string.base": "Description should be a text.",
      "string.empty": "Description should not be empty.",
      "any.required": "Description is required."
    }),
    imageUrl: Joi.string().uri().required().messages({
      "string.base": "Image URL should be a text.",
      "string.empty": "Image URL should not be empty.",
      "string.uri": "Image URL should be a valid URL.",
      "any.required": "Image URL is required."
    }),
    price: Joi.number().min(0).required().messages({
      "number.base": "Price should be a number.",
      "number.min": "Price cannot be negative.",
      "any.required": "Price is required."
    }),
    discount: Joi.number().min(0).max(100).default(0).messages({
      "number.base": "Discount should be a number.",
      "number.min": "Discount cannot be negative.",
      "number.max": "Discount cannot be more than 100%."
    }),
    category: Joi.string().trim().required().messages({
      "string.base": "Category should be a text.",
      "string.empty": "Category should not be empty.",
      "any.required": "Category is required."
    }),
    brand: Joi.string().trim().required().messages({
      "string.base": "Brand should be a text.",
      "string.empty": "Brand should not be empty.",
      "any.required": "Brand is required."
    }),
    ratings: Joi.number().min(0).max(5).default(0).messages({
      "number.base": "Ratings should be a number.",
      "number.min": "Ratings cannot be less than 0.",
      "number.max": "Ratings cannot be more than 5."
    }),
    tags: Joi.array().items(Joi.string().trim().lowercase()).messages({
      "array.base": "Tags should be an array of strings."
    }),
    searchKeywords: Joi.array().items(Joi.string().trim().lowercase()).messages({
      "array.base": "Search keywords should be an array of strings."
    })
  });

  return Schema.validate(data);
};



export const validateSearchFilters = (data) => {
  // Convert empty strings to undefined before validation
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === "string" && data[key].trim() === "") {
      data[key] = undefined;
    }
  });

  const schema = Joi.object({
    searchQuery: Joi.string()
      .trim()
      .optional()
      .messages({ "string.base": "Search query must be a text string." }),

    category: Joi.string()
      .trim()
      .optional()
      .messages({ "string.base": "Category must be a text string." }),

    brand: Joi.string()
      .trim()
      .optional()
      .messages({ "string.base": "Brand must be a text string." }),

    discount: Joi.string()
      .trim()
      .pattern(/^\d+$/) // Only numbers in string format like "10"
      .optional()
      .messages({
        "string.pattern.base": "Discount must be a number in string format (e.g., '10').",
      }),

    price: Joi.string()
    .trim()
    .pattern(/^\d+$/)
    .custom((value, helpers) => {
      const num = parseInt(value, 10);
      if (num < 1 || num > 1000000000) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "Price range validation")
    .optional()
    .messages({
      "string.pattern.base": "Price must be a numeric value.",
      "any.invalid": "Price must be between 1 and 1,000,000,000.",
    }),

    sortOrder: Joi.string()
      .trim()
      .valid("price_asc", "price_desc")
      .optional()
      .messages({
        "any.only": "Sort order must be 'asc' (ascending) or 'desc' (descending).",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};


export const validateUpdateProduct = (data) => {
  const Schema = Joi.object({
    description: Joi.string().trim().allow('').optional().messages({
      'string.base': 'Description should be a string.',
    }),
    imageUrl: Joi.string().uri().allow('').optional().messages({
      'string.uri': 'Image URL must be a valid URL.',
    }),
    price: Joi.number().min(0).allow('').optional().messages({
      'number.base': 'Price must be a positive number.',
      'number.min': 'Price cannot be negative.',
    }),
    discount: Joi.number().min(0).max(100).allow('').optional().messages({
      'number.base': 'Discount must be a number.',
      'number.min': 'Discount cannot be negative.',
      'number.max': 'Discount cannot be greater than 100.',
    }),
    tags: Joi.array().items(Joi.string().trim().lowercase().allow('')).allow('').optional().messages({
      'array.base': 'Tags should be an array of strings.',
    }),
    searchKeywords: Joi.array().items(Joi.string().trim().lowercase().allow('')).allow('').optional().messages({
      'array.base': 'Search keywords should be an array of strings.',
    }),
    name: Joi.string().trim().allow('').optional().messages({
      'string.base': 'Name should be a string.',
    }),
    category: Joi.string().trim().allow('').optional().messages({
      'string.base': 'Category should be a string.',
    }),
    brand: Joi.string().trim().allow('').optional().messages({
      'string.base': 'Brand should be a string.',
    }),
  })
  .or('description', 'imageUrl', 'price', 'discount', 'tags', 'searchKeywords'); 

  return Schema.validate(data);
};
