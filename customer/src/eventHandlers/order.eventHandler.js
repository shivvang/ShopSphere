import Customer from "../database/models/customer.model.js";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js"

export const addOrderToCustomer = async(event)=>{
    log.info("Adding product to Order...", { event });
    try {
        const { userId, productId, quantity,name, imageUrl, priceAtPurchase} = event;

        if (!userId || !productId || !quantity) {
            log.error("Missing userId, productId, or quantity in request", { userId, productId, quantity });
            throw new ApiError(400, "User ID, Product ID, and Quantity are required.");
        }

        const customer = await Customer.findById(userId);
        if (!customer) {
            log.warn("Customer not found", { userId });
            throw new ApiError(404, "Customer not found.");
        }

        const existingItem = customer.orders.find(item => item.productId.equals(productId));

        if (existingItem && existingItem.status !== "cancelled") {
            log.warn("Product is already ordered");
            throw new ApiError(400, "Order already exists.");
        }else {
            customer.orders.push({ productId, quantity ,name, imageUrl, priceAtPurchase });
        }

        await customer.save();

        log.info("Product added to Order successfully", { userId, productId, quantity ,name, imageUrl, priceAtPurchase });

    } catch (error) {
        log.error("Error adding product to cart", { error: error.message, stack: error.stack });
        throw new ApiError(500, "Internal Server Error", error);
    }
}

export const deleteOrderToCustomer = async(event)=>{
    log.info("Deleting product from  Order...", { event });
    try {
        const { userId, productId } = event;

        if (!userId || !productId) {
            log.error("Missing userId or productId in request", { userId, productId });
            throw new ApiError(400, "User ID and Product ID are required.");
        }

        const customer = await Customer.findById(userId);

        if (!customer) {
            log.warn("Customer not found", { userId });
            throw new ApiError(404, "Customer not found.");
        }

        customer.orders.map(item => {
            if (item.productId.toString() === productId) {
                item.status = "cancelled";
            }
        });

        await customer.save();

        log.info("Product removed from Order successfully", { userId, productId });
    } catch (error) {
        log.error("Error deleting product from Order", { error: error.message, stack: error.stack });
        throw new ApiError(500, error.message);
    }
}    

export const processOrder = async (event) => {
    log.info(`Processing order event: ${JSON.stringify(event)}`);

    try {
        const { userId, productId } = event;

        if (!userId || !productId) {
            log.warn("Missing required fields: userId or productId", { userId, productId });
            throw new ApiError(400, "Invalid request: userId and productId are required.");
        }

        const customer = await Customer.findById(userId);

        if (!customer) {
            log.warn(`Customer not found: ${userId}`);
            throw new ApiError(404, "Customer not found.");
        }

        const existingItem = customer.orders.find(order => order.productId.equals(productId));
        
        if (!existingItem) {
            log.warn(`Order not found for Product: ${productId} in User: ${userId}'s order history`);
            throw new ApiError(404, "Order not found for the specified product.");
        }

        existingItem.status = "delivered";
        await customer.save();

        log.info(`Order for Product: ${productId} marked as delivered for User: ${userId}`);

    } catch (error) {
        log.error(`Error processing order for User: ${event.userId}`, { 
            error: error.message, 
            stack: error.stack 
        });
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
};