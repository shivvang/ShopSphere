import Order from "../database/models/Order.model.js";
import { deilveryQueue } from "../Queue/bullmq.js";
import { publishEventToExchange } from "../Queue/rabbitmq.js";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js"

export const setOrder = async (req, res, next) => {
    log.info("setOrder entry point hit");

    try {
        const { userId } = req;
        const { productId, quantity, priceAtPurchase } = req.body;

        if (!userId || !productId || !quantity || quantity <= 0 || !priceAtPurchase || priceAtPurchase <= 0) {
            log.warn("Invalid request: Missing or invalid fields.");
            return next(new ApiError("Invalid request. Ensure userId, productId, quantity, and priceAtPurchase are provided correctly.", 400));
        }

        // Check if order for the same product and user already exists
        const existingOrder = await Order.findOne({ userId, productId });

        if (existingOrder) {
            log.info(`Order already exists for product ${productId} by user ${userId}. No action taken.`);
            return res.status(200).json({ message: "Order already exists", order: existingOrder });
        }

        // Create a new order
        const order = new Order({
            userId,
            productId,
            quantity,
            priceAtPurchase,
            status: "pending"
        });

        await order.save();
        log.info(`New order created: ${order._id}`);

        const jobData = { orderId: order._id,userId,productId,priceAtPurchase,quantity};

        // Add to delivery queue
        await deilveryQueue.add("processOrder",jobData, {
            jobId: order._id.toString(),
            delay: 0,
            removeOnComplete: true,
            removeOnFail: false,
        });

        // Publish event to notify system of the new order
        await publishEventToExchange("order.place", {
            orderId: order._id.toString(),
            userId: userId.toString(),
            productId: productId.toString(),
        });

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
        const userId = req.userId;
        const productId = req.params.productId;

        if (!userId || !productId) {
            log.warn("Missing required parameters: userId or productId.");
            return next(new ApiError("User ID and Product ID are required.", 400));
        }

        const order = await Order.findOne({ userId, productId });
        if (!order) {
            log.warn(`No active order found for user: ${userId} and product: ${productId}`);
            return next(new ApiError("No active order found to cancel.", 404));
        }

        // Update order status to cancelled
        order.status = "cancelled";
        await order.save();
        log.info(`Order ${order._id} cancelled successfully.`);


        const jobId = order._id.toString();

        // Remove the job from the queue
        await deilveryQueue.getJob(jobId).then(job => {
            if (job) {
            return job.remove();
            }
        });

        // Publish cancellation event
        await publishEventToExchange("order.cancel", {
            orderId: order._id.toString(),
            userId: userId.toString(),
        });

        return res.status(200).json({ message: "Order cancelled successfully." });
    } catch (error) {
        log.error("Error cancelling order:", error);
        return next(new ApiError("Failed to cancel order. Please try again later.", 500));
    }
};
