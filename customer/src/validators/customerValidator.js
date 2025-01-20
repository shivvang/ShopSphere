import Joi from "joi";

export const validateRegistration = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.base": `"email" should be a type of text`,
                "string.empty": `"email" cannot be empty`,
                "string.email": `"email" must be a valid email format`,
                "any.required": `"email" is a required field`
            }),
        password: Joi.string()
            .min(6)
            .required()
            .messages({
                "string.base": `"password" should be a type of text`,
                "string.empty": `"password" cannot be empty`,
                "string.min": `"password" should have a minimum length of {#limit}`,
                "any.required": `"password" is a required field`
            }),
        phone: Joi.number()
            .integer()
            .min(1000000000) // Ensures 10-digit number
            .max(9999999999)
            .required()
            .messages({
                "number.base": `"phone" should be a number`,
                "number.empty": `"phone" cannot be empty`,
                "number.min": `"phone" should have a minimum length of 10 digits`,
                "number.max": `"phone" should have a maximum length of 10 digits`,
                "any.required": `"phone" is a required field`
            })
    });

    return schema.validate(data, { abortEarly: false });
};
