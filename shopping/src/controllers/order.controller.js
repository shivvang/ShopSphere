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
        let { name, imageUrl, priceAtPurchase, quantity = 1 } = req.body;

        if (!userId || !productId || !quantity || quantity <= 0 || !priceAtPurchase || priceAtPurchase <= 0) {
            log.warn("Invalid request: Missing or invalid fields.");
            return next(new ApiError("Invalid request. Ensure all required fields are provided correctly.", 400));
        }

        let order = await Order.findOne({ userId, "items.productId": productId });

        if (order) {
            log.info(`Order exists for product ${productId} by user ${userId}. Updating quantity.`);
            
            return res.status(400).json({ 
                message: `Order for product ${productId} already exists. Cannot place another order for the same product.` 
            });

        } 
           
        order = new Order({
            userId,
            items: [{ productId, name, imageUrl, priceAtPurchase, quantity}],
        });

        await order.save();

        log.info(`Order saved for user ${userId} and product ${productId}.`);

       
        const jobData = { userId, productId, priceAtPurchase, quantity };

       
        const delay = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

        log.info(`Adding new job for user ${userId}`);
            await deliveryQueue.add("processOrder", jobData, {
                jobId: productId.toString(),
                delay, 
                removeOnComplete: true,
                removeOnFail: false,
            });    
        

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

        let itemCancelled = false;

        order.items.forEach(item => {
            if (item.productId.toString() === productId && item.status !== "cancelled") {
                item.status = "cancelled";
                itemCancelled = true;
            }
        });

        if (!itemCancelled) {
            log.info(`Order item ${productId} was already cancelled.`);
            return res.status(400).json({ message: "This product has already been cancelled." });
        }

        await order.save();
        log.info(`Order updated after cancellation: ${order._id}`);

        const jobId = productId.toString();
        const job = await deliveryQueue.getJob(jobId);
        if (job) {
            await job.remove();
            log.info(`Job with ID ${jobId} removed from delivery queue.`);
        } else {
            log.warn(`No job found with ID ${jobId} in delivery queue.`);
        }
        await publishEventToExchange("order.cancel", { userId, productId });

        return res.status(200).json({ message: "Order cancelled successfully.", order });
    } catch (error) {
        log.error("Error cancelling order:", error);
        return next(new ApiError("Failed to cancel order. Please try again later.", 500));
    }
};
