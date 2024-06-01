import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import payment from "../../../utils/payment.js";

const minPointsRequired = 80; // تحديد الحد الأدنى لعدد النقاط المطلوبة لتحويلها

//delete user
export const deleteUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
        return next(new Error("User Not Found", { cause: 404 }));
    }

    const deleteUser = await userModel.findOneAndDelete({ _id: userId });
    return res.status(200).json({ message: "User deleted successfully" });
});

// تحويل النقاط إلى نقود
export const convertPointsToCash = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // التحقق من أن لدى المستخدم الحد الأدنى المطلوب من النقاط
    if (user.points < minPointsRequired) {
        return res.status(400).json({ message: `User does not have enough points. Minimum ${minPointsRequired} points required.` });
    }

    // حساب مبلغ النقود الذي سيتم تحويله
    const cashAmount = user.points * 0.3; 

    // إنشاء جلسة الدفع باستخدام Stripe
    const session = await payment({
        customer_email: req.user.email,
        line_items: [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Cash conversion"
                },
                unit_amount: cashAmount 
            },
            quantity: 1
        }],
        success_url: `${process.env.SUCCESS_URL}`,
        cancel_url: `${process.env.CANCEL_URL}`
    });

    return res.json({ message: "Stripe Checkout session created", session });
});
