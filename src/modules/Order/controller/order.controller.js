import orderModel from "../../../../DB/models/Order.model.js";
import productModel from "../../../../DB/models/Product.model.js";
import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

// --------------Create Order-------------
export const createOrder = asyncHandler(async (req, res) => {
    const { address, phone, paymentTypes, note, products } = req.body;
    const userId = req.user._id;

    // تحقق من صحة المنتجات وكمياتها
    for (let item of products) {
        const product = await productModel.findById(item.productId);
        if (!product) {
            return res.status(400).json({ message: 'Product not found' });
        }
        if (product.stock < item.quantity) {
            return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
        }
    }

    // إنشاء الطلب
    const order = await orderModel.create({
        userId,
        address,
        phone,
        paymentTypes,
        note,
        products
    });

    res.status(201).json({ message: 'Order created successfully', order });
});

//--------- Cancel Order------------
export const cancelOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await orderModel.findById(orderId);
    if (!order || order.userId.toString() !== userId.toString()) {
        return res.status(404).json({ message: 'Order not found or you are not authorized to cancel this order' });
    }

    order.status = 'canceled';
    await order.save();

    res.status(200).json({ message: 'Order canceled successfully', order });
});

//-------------- Deliver Order--------------
export const deliverOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    // حساب النقاط الإجمالية للطلب
    let totalPoints = 0;
    for (let item of order.products) {
        const product = await productModel.findById(item.productId);
        if (product) {
            totalPoints += product.points * item.quantity;
        }
    }

    // تحديث حالة الطلب
    order.status = 'delivered';
    await order.save();

    if (order.paymentOption === 'points') {
        // تحديث نقاط المستخدم
        const user = await userModel.findById(order.userId);
        if (user) {
            user.points += totalPoints;
            await user.save();
        }
        res.status(200).json({ message: 'Order delivered successfully and points added', order, totalPoints, userPoints: user.points });
    } else if (order.paymentOption === 'cash') {
        const cashAmount = totalPoints * 0.5; // تحويل النقاط إلى مبلغ نقدي
        res.status(200).json({ message: 'Order delivered successfully and cash payment selected', order, cashAmount });
    }
});



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

// Webhook handler
export const webHook = asyncHandler(async (req, res) => {
    // معالجة webhook هنا
    res.status(200).json({ message: 'Webhook received' });
});
