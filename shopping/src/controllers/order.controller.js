import Order from "../database/models/Order.model.js";
import { deliveryQueue } from "../Queue/bullmq.js";
import { publishEventToExchange } from "../Queue/rabbitmq.js";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js"

export const setOrder = async (req, res, next) => {
    log.info("setOrder entry point hit");

    try {
        const userId = req.user;
        const productId = req.params.productId;
        const { name, imageUrl, priceAtPurchase, quantity } = req.body;

        if (!userId || !productId || !quantity || quantity <= 0 || !priceAtPurchase || priceAtPurchase <= 0) {
            log.warn("Invalid request: Missing or invalid fields.");
            return next(new ApiError("Invalid request. Ensure all required fields are provided correctly.", 400));
        }

        let order = await Order.findOne({ userId, "items.productId": productId });

        if (order) {
            log.info(`Order exists for product ${productId} by user ${userId}. Updating quantity.`);
            
            const item = order.items.find(item => item.productId.toString() === productId);
            if (item) {
                item.quantity += quantity;
                await order.save();
                return res.status(200).json({ message: "Order updated successfully", order });
            }
        } else {
            order = new Order({
                userId,
                items: [{ productId, name, imageUrl, priceAtPurchase, quantity }],
            });
        }

        await order.save();
        // log.info(`New order created: ${order._id}`);

        // const jobData = { orderId: order._id, userId, productId, priceAtPurchase, quantity };
        // await deliveryQueue.add("processOrder", jobData, {
        //     jobId: order._id.toString(),
        //     delay: 0,
        //     removeOnComplete: true,
        //     removeOnFail: false,
        // });

        await publishEventToExchange("order.place", { userId, productId, quantity,name, imageUrl, priceAtPurchase });

        log.info(`Order processing event published for order: ${order._id}`);
        return res.status(201).json({ message: "Order placed successfully", order });

    } catch (error) {
        log.error("Error placing order", error);
        return next(new ApiError("Failed to place order. Please try again later.", 500));
    }
};

export const cancelOrder = async (req, res, next) => {
    log.info("Cancel order endpoint hit...");
    
    try {
        const userId = req.user;
        const productId = req.params.productId;

        if (!userId || !productId) {
            log.warn("Missing required parameters: userId or productId.");
            return next(new ApiError("User ID and Product ID are required.", 400));
        }

        const order = await Order.findOne({ userId, "items.productId": productId });
        if (!order) {
            log.warn(`No active order found for user: ${userId} and product: ${productId}`);
            return next(new ApiError("No active order found to cancel.", 404));
        }

        order.items = order.items.map(item => {
            if (item.productId.toString() === productId) {
                item.status = "cancelled";
            }
            return item;
        });

        if (order.items.every(item => item.status === "cancelled")) {
            order.status = "cancelled";
        }

        await order.save();
        // log.info(`Order updated after cancellation: ${order._id}`);

        // const jobId = order._id.toString();
        // await deliveryQueue.getJob(jobId).then(job => job?.remove());

        await publishEventToExchange("order.cancel", { userId, productId });

        return res.status(200).json({ message: "Order cancelled successfully.", order });
    } catch (error) {
        log.error("Error cancelling order:", error);
        return next(new ApiError("Failed to cancel order. Please try again later.", 500));
    }
};
