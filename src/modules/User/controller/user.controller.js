import productModel from "../../../../DB/models/Product.model.js";
import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // تأكد من ضبط مفتاح Stripe السري في ملف البيئة



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
  //-------------change points--------
  export const convertPointsToCash = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const cashAmount = user.points * 0.5; // تحويل النقاط إلى مبلغ نقدي

    // معلومات حساب Stripe للمستخدم
    const { stripeAccountId } = user; // افتراض أن هذا المعرف موجود في نموذج المستخدم

    if (!stripeAccountId) {
        return res.status(400).json({ message: 'Stripe account details are missing' });
    }

    // إنشاء تحويل الأموال
    const transfer = await stripe.transfers.create({
        amount: Math.round(cashAmount * 100), // تحويل المبلغ إلى سنتات
        currency: 'usd',
        destination: stripeAccountId,
        transfer_group: `USER_${userId}` // تغيير group_transfer للتعبير عن المستخدم
    });

    // تحديث نقاط المستخدم بعد نجاح التحويل
    user.points = 0; // إعادة تعيين النقاط بعد التحويل
    await user.save();

    res.status(200).json({ message: 'Points converted to cash and transferred successfully', cashAmount, transfer });
});