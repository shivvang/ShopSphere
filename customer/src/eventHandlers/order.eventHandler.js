import { Notification } from "../database/Database.js";
import Customer from "../database/models/customer.model.js";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js"

export const addOrderToCustomer = async(event)=>{
    log.info("Adding product to Order...", { event });
    try {
        const { userId, productId, quantity,name, imageUrl, priceAtPurchase,brand} = event;

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
            customer.orders.push({ productId, quantity ,name, imageUrl, priceAtPurchase,brand });
        }

        await customer.save();

        //pre prepare notification data
        await Notification.create({
            customerId:userId,
            message: `Your order for product ${productId} has Arrived!`,
            name,
            imageUrl,
            productId,
            priceAtPurchase,
            quantity,
            brand
        })

        log.info("Product added to Order successfully", { userId, productId, quantity ,name, imageUrl, priceAtPurchase ,brand});

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

export const createOrderFromCheckout = async (event) => {
    try {
        const { userId, items } = event;

        if (!userId || !items || items.length === 0) {
            log.warn("Missing required fields: userId or items", { userId, items });
            throw new ApiError(400, "Invalid request: userId and items are required.");
        }

        const customer = await Customer.findById(userId);

        if (!customer) {
            log.warn(`Customer not found: ${userId}`);
            throw new ApiError(404, "Customer not found.");
        }

        for (const item of items) {
          
            const existingOrder = customer.orders.find(order =>
                order.productId.toString() === item.productId.toString()
            );

            if (existingOrder) {
                if (existingOrder.status !== "cancelled") {
                    log.warn(`Duplicate order for product ${item.productId} with status: ${existingOrder.status}`);
                    throw new ApiError(400, `Product ${item.productId} is already ordered and not cancelled.`);
                }
            }

           
            customer.orders.push({
                productId: item.productId,
                name: item.name,
                brand: item.brand,
                imageUrl: item.imageUrl,
                priceAtPurchase: item.priceAtPurchase,
                quantity: item.quantity,
                status: item.status || "shipped"
            });
        }

       
        await customer.save();

        log.info(`Order created successfully for User: ${userId}`);
        return { success: true, message: "Order created successfully." };

    } catch (error) {
        log.error(`Error processing order for User: ${event.userId}`, { 
            error: error.message, 
            stack: error.stack 
        });
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
};