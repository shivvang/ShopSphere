import Customer from "../database/models/customer.model.js";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js"

export const addCartToCustomer = async (event) => {
    log.info("Adding product to cart...", { event });
    try {
        const { userId, productId, quantity,name, imageUrl, price,brand } = event;

        if (!userId || !productId || !quantity) {
            log.error("Missing userId, productId, or quantity in request", { userId, productId, quantity });
            throw new ApiError(400, "User ID, Product ID, and Quantity are required.");
        }

        const customer = await Customer.findById(userId);
        if (!customer) {
            log.warn("Customer not found", { userId });
            throw new ApiError(404, "Customer not found.");
        }

        const existingItem = customer.cart.find(item => item.productId.equals(productId));

        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            customer.cart.push({ productId, quantity,name, imageUrl, price,brand });
        }

        await customer.save();

        log.info("Product added to cart successfully", { userId, productId, quantity ,name, imageUrl, price,brand});

    } catch (error) {
        log.error("Error adding product to cart", { error: error.message, stack: error.stack });
        throw new ApiError(500, "Internal Server Error", error);
    }
};

export const deleteCartToCustomer = async (event) => {
    log.info("Deleting product from cart...", { event });
    try {
        const { userId, productId,quantity} = event;

        if (!userId || !productId || quantity > 0) {
            log.error("Missing userId or productId in request", { userId, productId });
            throw new ApiError(400, "User ID and Product ID are required.");
        }

        const customer = await Customer.findById(userId);
        if (!customer) {
            log.warn("Customer not found", { userId });
            throw new ApiError(404, "Customer not found.");
        }

        const initialLength = customer.cart.length;
        customer.cart = customer.cart.filter(item => !item.productId.equals(productId));

        if (customer.cart.length === initialLength) {
            log.warn("Product not found in cart", { userId, productId });
            throw new ApiError(404, "Product not found in cart.");
        }

        await customer.save();

        log.info("Product removed from cart successfully", { userId, productId });
    } catch (error) {
        log.error("Error deleting product from cart", { error: error.message, stack: error.stack });
        throw new ApiError(500, error.message);
    }
};


export const clearCartToCustomer = async (event) => {
    log.info("Clearing cart for customer...", { event });
    try {
        const { userId } = event;

        if (!userId) {
            log.error("Missing userId", { userId });
            throw new ApiError(400, "User ID is required.");
        }

        const customer = await Customer.findById(userId);
        if (!customer) {
            log.warn("Customer not found", { userId });
            throw new ApiError(404, "Customer not found.");
        }

        if (customer.cart.length === 0) {
            log.info("Cart is already empty", { userId });
            return;
        }

        customer.cart = [];
        await customer.save();

        log.info("Cart cleared successfully", { userId });
    } catch (error) {
        log.error("Error clearing cart", { error: error.message, stack: error.stack });
        throw new ApiError(500, error.message);
    }
};