import productModel from "../../../../DB/models/Product.model.js";
import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";



//delete user
export const deleteUser=asyncHandler(
    async (req,res,next)=>{
        
        const {userId}=req.params
        const user=await userModel.findOne({_id:userId})
        if(!user){
            return next(new Error("user Not Found",{cause:404}));
        }
  
  
        const deleteUser = await userModel.findOneAndDelete({_id:userId})
        return res.status(200).json({message:"Done"})
  
    }
  )