import joi from "joi";
export const productSchema = joi.object({
    name: joi.string().required(),
    price: joi.number().required(),
    images: joi.string().required(),
    details: joi.string(),
    categoryId: joi.string().required(),
});
