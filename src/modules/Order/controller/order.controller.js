import orderModel from "../../../../DB/models/Order.model.js";
import productModel from "../../../../DB/models/Product.model.js";
import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

// Create Order
export const createOrder = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const { products, paymentType, address, phone, note, reason } = req.body;
    let subPoints = 0;

    if (!products?.length) {
        return next(new Error("Products are required", { cause: 400 }));
    }

    const allProducts = [];
    for (const product of products) {
        const productExist = await productModel.findOne({
            _id: product.productId,
            isDeleted: false,
        });

        if (!productExist) {
            return next(new Error("Product not found", { cause: 400 }));
        }

        product.name = productExist.name;
        product.unitPoints = productExist.unitPoints; // Assuming unitPoints represents points for each unit
        product.totalPoints = productExist.unitPoints * product.quantity;
        allProducts.push(product);
        subPoints += product.unitPoints * product.quantity;
    }

    const status = paymentType === "cash" ? "placed" : "waitForPayment";

    const order = await orderModel.create({
        userId: _id,
        address,
        phone,
        paymentType,
        note,
        reason,
        products: allProducts,
        subPoints,
        finalPoints: 0, // Final points will be updated later when the order is delivered
        status,
    });

    return res.json({ message: "Order created successfully", order });
});

// Cancel Order
export const cancelOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const { _id } = req.user;

    const order = await orderModel.findById(orderId);

    if (!order) {
        return next(new Error("Order not found", { cause: 404 }));
    }

    if (order.status !== "placed" && order.status !== "waitForPayment") {
        return next(new Error("Order cannot be cancelled", { cause: 400 }));
    }

    // Refund points if payment type is points
    if (order.paymentType === "points") {
        await userModel.updateOne(
            { _id: order.userId },
            { $inc: { points: order.subPoints } }
        );
    }

    order.status = "cancelled";
    order.updatedBy = _id;
    await order.save();

    return res.status(200).json({ message: "Order cancelled successfully", order });
});

// Deliver Order
export const deliverOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);

    if (!order) {
        return next(new Error("Order not found", { cause: 404 }));
    }

    if (order.status !== "placed") {
        return next(new Error("Order cannot be marked as delivered", { cause: 400 }));
    }

    // Update final points and status
    order.finalPoints = order.subPoints;
    order.status = "delivered";
    order.updatedBy = req.user._id;
    await order.save();

    // Add points to user account if payment type is points
    if (order.paymentType === "points") {
        await userModel.updateOne(
            { _id: order.userId },
            { $inc: { points: order.subPoints } }
        );
    }

    return res.status(200).json({ message: "Order delivered successfully", order });
});

// Webhook
export const webHook = asyncHandler(async (req, res, next) => {
    return res.status(501).json({ message: "Webhook not implemented" });
});
