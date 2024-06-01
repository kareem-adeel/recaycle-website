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
  //-------------تحويل النقاط الي فلوس --------
export const convertPointsToCash = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const cashAmount = user.points * 0.5; // تحويل النقاط إلى مبلغ نقدي
    user.points = 0; // إعادة تعيين النقاط بعد التحويل
    await user.save();

    // هنا نضيف منطق لتحويل النقود إلى حساب المستخدم البنكي

    res.status(200).json({ message: 'Points converted to cash successfully', cashAmount });
});