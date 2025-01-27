import Order from "../database/models/Order.model.js";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js"

export const setOrder = async (req, res, next) => {
    log.info("set order entry point hit");

    try {
        const { userId } = req;
        const { productId, quantity, priceAtPurchase } = req.body; 

        if (!userId || !productId || !quantity || quantity <= 0 || !priceAtPurchase || priceAtPurchase <= 0) {
            log.warn("Invalid request: Missing or invalid fields.");
            return next(new ApiError("Invalid request. Ensure userId, productId, quantity, and priceAtPurchase are provided correctly.", 400));
        }

        let order = await Order.findOne({ userId });

        if (!order) {
            log.info(`Creating new order for user: ${userId}`);
            order = new Order({
                userId,
                products: [{ productId, quantity, priceAtPurchase }],
            });
        } else {
            const existingProduct = order.products.find(item => item.productId.toString() === productId);
        
            if (!existingProduct) {
                log.info(`Adding new product ${productId} to existing order for user: ${userId}`);
                order.products.push({ productId, quantity, priceAtPurchase });
            } else {
                log.info(`Product ${productId} already exists in the order. No action taken.`);
            }
        }

        await order.save();
        log.info(`Order created successfully for user: ${userId}`);

        return res.status(200).json({ message: "Order placed successfully", order });

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

        const order = await Order.findOne({ userId });

        if (!order) {
            log.warn(`No active order found for user: ${userId}`);
            return next(new ApiError("No active order found to cancel.", 404));
        }

        const productIndex = order.products.findIndex(item => item.productId.toString() === productId);

        if (productIndex === -1) {
            log.warn(`Product ${productId} not found in order for user: ${userId}`);
            return next(new ApiError("Product not found in the order.", 404));
        }

        // Remove product from order
        order.products.splice(productIndex, 1);

        // If no more products left in order, delete the entire order
        if (order.products.length === 0) {
            await Order.deleteOne({ _id: order._id });
            log.info(`Order ${order._id} deleted as no products remain.`);
        } else {
            await order.save();
            log.info(`Product ${productId} removed from order ${order._id}.`);
        }

        return res.status(200).json({ message: "Product successfully removed from order." });

    } catch (error) {
        log.error("Error cancelling order:", error);
        return next(new ApiError("Failed to cancel order. Please try again later.", 500));
    }
};
