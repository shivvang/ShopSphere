import Joi from "joi";

export const validateRegistrationAddress = (data) => {
    const Schema = Joi.object({
        street: Joi.string().required().messages({
            "string.base": "Street should be a type of text",
            "any.required": "Street is required",
        }),
        postalCode: Joi.string().required().messages({
            "string.base": "Postal Code should be a type of text",
            "any.required": "Postal Code is required",
        }),
        city: Joi.string().required().messages({
            "string.base": "City should be a type of text",
            "any.required": "City is required",
        }),
        state: Joi.string().required().messages({
            "string.base": "State should be a type of text",
            "any.required": "State is required",
        }),
        country: Joi.string().required().messages({
            "string.base": "Country should be a type of text",
            "any.required": "Country is required",
        }),
    });

    return Schema.validate(data);
};