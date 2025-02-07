import Customer from "../models/customerModel.js";
import { ApiError } from "../utils/ApiError.js";
import { log } from "../utils/logger.js";


export const addOrderToCustomer = async(event)=>{
    log.info("Adding product to Order...", { event });
    try {
        const { userId, productId, quantity } = event;

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

        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            customer.orders.push({ productId, quantity });
        }

        await customer.save();

        log.info("Product added to Order successfully", { userId, productId, quantity });

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

        const initialLength = customer.orders.length;
        customer.cart = customer.orders.filter(item => !item.productId.equals(productId));

        if (customer.orders.length === initialLength) {
            log.warn("Product not found in cart", { userId, productId });
            throw new ApiError(404, "Product not found in cart.");
        }

        await customer.save();

        log.info("Product removed from Order successfully", { userId, productId });
    } catch (error) {
        log.error("Error deleting product from Order", { error: error.message, stack: error.stack });
        throw new ApiError(500, error.message);
    }
}    