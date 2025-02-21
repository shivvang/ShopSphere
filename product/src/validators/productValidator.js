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
    stock: Joi.number().integer().min(0).required().messages({
      "number.base": "Stock should be a number.",
      "number.min": "Stock cannot be negative.",
      "any.required": "Stock is required."
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
      .pattern(/^\d+-\d+$/) // "min-max" format like "100-500"
      .optional()
      .messages({
        "string.pattern.base": "Price should be in 'min-max' format (e.g., '100-500').",
      }),

    rating: Joi.string()
      .trim()
      .pattern(/^\d(\.\d+)?-\d(\.\d+)?$/) // "min-max" format like "4.0-5.0"
      .optional()
      .messages({
        "string.pattern.base": "Rating should be in 'min-max' format (e.g., '4.0-5.0').",
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
    name: Joi.string().trim().optional().messages({
      "string.base": "Name should be a string.",
      "string.empty": "Name cannot be empty.",
    }),
    description: Joi.string().trim().optional().messages({
      "string.base": "Description should be a string.",
      "string.empty": "Description cannot be empty.",
    }),
    imageUrl: Joi.string().uri().optional().messages({
      "string.uri": "Image URL must be a valid URL.",
    }),
    stock: Joi.number().integer().min(0).optional().messages({
      "number.base": "Stock must be a number.",
      "number.min": "Stock cannot be negative.",
    }),
    price: Joi.number().min(0).optional().messages({
      "number.base": "Price must be a positive number.",
      "number.min": "Price cannot be negative.",
    }),
    discount: Joi.number().min(0).max(100).optional().default(0).messages({
      "number.base": "Discount must be a number.",
      "number.min": "Discount cannot be negative.",
      "number.max": "Discount cannot be greater than 100.",
    }),
    category: Joi.string().trim().optional().messages({
      "string.base": "Category must be a string.",
    }),
    brand: Joi.string().trim().optional().messages({
      "string.base": "Brand must be a string.",
    }),
    ratings: Joi.number().min(0).max(5).optional().messages({
      "number.base": "Ratings must be a number between 0 and 5.",
      "number.min": "Ratings cannot be less than 0.",
      "number.max": "Ratings cannot be more than 5.",
    }),
    tags: Joi.array().items(Joi.string().trim().lowercase()).optional().messages({
      "array.base": "Tags should be an array of strings.",
    }),
    searchKeywords: Joi.array().items(Joi.string().trim().lowercase()).optional().messages({
      "array.base": "Search keywords should be an array of strings.",
    })
  });

  return Schema.validate(data);
};
