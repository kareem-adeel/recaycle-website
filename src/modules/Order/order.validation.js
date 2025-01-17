import joi from "joi"
import generalFields from "../../utils/generalFields.js"

export const tokenSchema=joi.object({
    authorization:joi.string().required()
}).required()


export const createOrderSchema=joi.object({
    
    address:joi.string().required(),
    paymentTypes:joi.string().valid('cash','points','Donate'),
    note:joi.string(),
    reason:joi.string(),
    
    products:joi.array().items(joi.object({
        productId:generalFields.id,
        quantity:joi.number().positive().integer().required(),
        paymentOption: joi.string().valid('cash', 'points','Donate').required(), // خيار الدفع
    }).required())
}).required()


export const orderSchema=joi.object({
    orderId:generalFields.id
}).required()
