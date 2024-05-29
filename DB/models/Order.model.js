import mongoose,{model,Schema, Types} from "mongoose";

export const orderSchema=new Schema({

        userId:{
            type:Types.ObjectId,
            require:true,
            ref:'User',
            
        },
        products:[
            {   name:{
                    type:String,
                    required:[true,"Phone Number Is required"],
                    min:3,
                    max:30
                },
                productId:{
                    type:Types.ObjectId,
                    required:true,
                    ref:'Product'
                },
                quantity:{
                    type:Number,
                required:true
                },
                totalPoints:{
                    type:Number,
                    required:[true,"totalPoints Number Is required"],
                    min:1
                },
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
        finalPoints:{
            type:Number,
            required:[true,"finalPoint Number Is required"],
            min:1
        },
        subPoints:{
            type:Number,
            required:[true,"subpoint Number Is required"],
            min:1
        },
        note:String,
        paymentTypes:{
            type:String,
            enum:['cash','points'],
            default:'cash'
        },
        status:{
            type:String,
            enum:['placed','onWay','cancel','rejected','deliverd'],
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


