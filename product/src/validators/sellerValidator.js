import Joi from "joi";

export const validateSeller = (data) => {
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
        phone: Joi.string()
            .pattern(/^\d{10}$/)
            .required()
            .messages({
               "string.pattern.base": `"phone" must be exactly 10 digits`,
               "string.empty": `"phone" cannot be empty`,
               "any.required": `"phone" is a required field`
            }),
        shopName:Joi.string()
        .required()
        .messages({
          "string.base": `"shopName" should be a type of text`,
          "string.empty": `"shopName" cannot be empty`,
          "any.required": `"shopName" is a required field`
            }),    
    })
return schema.validate(data);
}

export const validateLogin = (data)=>{
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
    })
    return schema.validate(data);
}


export const validateNewPassWord = (data)=>{
    const schema = Joi.object({
        oldPassword: Joi.string()
            .min(6)
            .required()
            .messages({
                "string.base": `"password" should be a type of text`,
                "string.empty": `"password" cannot be empty`,
                "string.min": `"password" should have a minimum length of {#limit}`,
                "any.required": `"password" is a required field`
            }),

            newPassword: Joi.string()
            .min(6)
            .required()
            .messages({
                "string.base": `"password" should be a type of text`,
                "string.empty": `"password" cannot be empty`,
                "string.min": `"password" should have a minimum length of {#limit}`,
                "any.required": `"password" is a required field`
            }),
    })

    return schema.validate(data);
}