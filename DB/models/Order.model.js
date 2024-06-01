import mongoose,{model,Schema, Types} from "mongoose";

export const orderSchema=new Schema({

        userId:{
            type:Types.ObjectId,
            require:true,
            ref:'User',
            
        },
        products:[
            {  
                productId:{
                    type:Types.ObjectId,
                    required:true,
                    ref:'Product'
                },
                quantity:{
                    type:Number,
                required:true
                }
                
            }
        ],
        address:{
            type:String,
            required:[true,"Address Number Is required"]
        },
        phone:{
            type:[String],
            required:[true,"Phone Number Is required"]
        },
        
        note:String,
        paymentTypes:{
            type:String,
            enum:['cash','points','Donate'],
            default:'cash'
        },
        status:{
            type:String,
            enum:['placed','onWay','canceled','rejected','delivered'],
            default:'placed'
        },
        updatedBy:{
            type:Types.ObjectId,
            ref:'User'
        },
        reason:String
},{
    timestamps:true
})
//mongoose.model.orderSchema||
const orderModel=model('Order',orderSchema)

export default orderModel


