import {Worker} from "bullmq"
import log from "../utils/logHandler"
import io from "../Socket/Socket.js";
import Order from "../database/models/Order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { publishEventToExchange } from "./rabbitmq.js";

const deliveryWorker = new Worker(
    "processOrder",
    async (job) => {
        const { userId, productId, priceAtPurchase, quantity } = job.data;

        log.info(`Processing order for product ${productId}, delivery for user ${userId}`);

        try {
            if (!userId || !productId) {
                log.warn("Order data is incomplete: missing userId or productId.");
                return;
            }

            if (!priceAtPurchase || !quantity) {
                log.warn("Order data is incomplete: missing priceAtPurchase or quantity.");
                return;
            }

            const order = await Order.findOne({ userId, "items.productId": productId });

            if (!order) {
                log.warn(`No order found for user ${userId} with product ${productId}`);
                return;
            }

            const item = order.items.find((item) => item.productId.toString() === productId);
            if (item) {
                item.status = "delivered"; 
                await order.save();
                log.info(`Order updated: Product ${productId} marked as delivered for user ${userId}`);
            } else {
                log.warn(`Product ${productId} not found in user's order ${order._id}`);
            }

           
            publishEventToExchange("order.processed", { userId, productId });

        } catch (error) {
            log.error("Error processing order", { error: error.message, stack: error.stack });
            throw new ApiError("Failed to process order");
        }
    },
    {
        connection: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
        }
    }
);



deliveryWorker.on("completed", (job) => {
    const { userId, productId, priceAtPurchase, quantity } = job.data;

    log.info(`Order processing completed for user ${userId}, product ${productId}`);

    if (!userId) {
        log.warn("Cannot emit delivery update: userId is missing.");
        return;
    }

    io.to(userId).emit("deliveryUpdate", {
        message: `Your order for product ${productId} has been delivered!`,
        productId,
        priceAtPurchase,
        quantity,
    });
});


deliveryWorker.on("failed", (job, err) => {
    log.error(`Job ${job.id} failed: ${err.message}`);
});