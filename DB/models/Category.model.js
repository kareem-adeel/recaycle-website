import mongoose, { Schema,model } from "mongoose";
import { Types } from "mongoose";

export const categorySchema=new Schema({
    name:{
        type:String,
        required:[true, "name Is Required"],
        unique:[true,"name Must Be Unique Value"],
        trim:true,
        lowerCase:true
    },
    image:{
        type:Object,
        required:[true,"Image Is Required"]
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"Admin",
        required:[true,"createdBy Is Required"]
        

    },
    updatedBy:{
        type:Types.ObjectId,
        ref:"Admin"

    },
    slug:{
        type:String,
        required:[true,"Slug Is Required"],
        unique:[true,'Slug Must Be Unique Value'],
        trim:true,
        lowerCase:true
    }
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

categorySchema.virtual('Product',{
    ref:"Product",
    localField:'_id',
    foreignField:'categoryId'
})


const categoryModel=mongoose.model.categoryModel||model("Category",categorySchema)

export default categoryModel

