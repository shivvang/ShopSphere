
import Customer from "../database/models/customer.model.js";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js"

export const addWishlistToCustomer = async (event) => {
    log.info("Adding product to wishlist...", { event });

    try {
        const { userId, productId,name, imageUrl, price , brand} = event;

        if (!userId || !productId) {
            log.error("Missing userId or productId in request", { userId, productId });
            throw new ApiError(400, "User ID and Product ID are required.");
        }

        const customer = await Customer.findById(userId);
        if (!customer) {
            log.warn("Customer not found", { userId });
            throw new ApiError(404, "Customer not found.");
        }

        const alreadyExists = customer.wishlist.some(wish => wish.productId.equals(productId));

        if (alreadyExists) {
            log.info("Product already in wishlist", { userId, productId });
            return;
        }

        customer.wishlist.push({ productId , name , imageUrl , price,brand });
        await customer.save();

        log.info("Product added to wishlist successfully", { userId, productId ,name, imageUrl, price,brand});

    } catch (error) {
        log.error("Error adding product to wishlist", { error: error.message, stack: error.stack });
        throw new ApiError(500, "Internal Server Error", error);
    }
};


export const deleteWishlistToCustomer = async (event) => {
    log.info("Deleting product from wishlist...", { event });

    try {
        const { userId, productId } = event;

        if (!userId || !productId) {
            log.error("Missing userId or productId", { userId, productId });
            throw new ApiError(400, "User ID and Product ID are required.");
        }

        const customer = await Customer.findById(userId);
        if (!customer) {
            log.warn("Customer not found", { userId });
            throw new ApiError(404, "Customer not found.");
        }

        const initialLength = customer.wishlist.length;
        customer.wishlist = customer.wishlist.filter(wish => !wish.productId.equals(productId));

        if (customer.wishlist.length === initialLength) {
            log.warn("Product not found in wishlist", { userId, productId });
            throw new ApiError(404, "Product not found in wishlist.");
        }

        await customer.save();

        log.info("Product removed from wishlist", { userId, productId });

    } catch (error) {
        log.error("Error deleting product from wishlist", { error: error.message, stack: error.stack });
        throw new ApiError(500, error.message);
    }
};

export const clearWishlistToCustomer = async (event) => {
    log.info("Clearing wishlist for customer...", { event });

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

        if (customer.wishlist.length === 0) {
            log.info("Wishlist is already empty", { userId });
            return;
        }

        customer.wishlist = [];
        await customer.save();

        log.info("Wishlist cleared successfully", { userId });

    } catch (error) {
        log.error("Error clearing wishlist", { error: error.message, stack: error.stack });
        throw new ApiError(500, error.message);
    }
};