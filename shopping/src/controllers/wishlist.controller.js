import Wishlist from "../database/models/Wishlist.model.js";
import { publishEventToExchange } from "../Queue/rabbitmq.js";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js"

export const addToWishlist = async (req, res, next) => {
    log.info("Add to wishlist endpoint hit");

    try {
        const userId = req.userId;
        const productId = req.params.productId;

        if (!userId || !productId) {
            log.warn("Missing userId or productId in request");
            return next(new ApiError("User ID and Product ID are required", 400));
        }

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            log.info(`No wishlist found for user: ${userId}, creating new wishlist`);
            wishlist = new Wishlist({
                userId,
                items: [{ productId }],
            });
        } else {
            const existingItem = wishlist.items.find(item => item.productId.toString() === productId);

            if (existingItem) {
                log.info(`Product ${productId} is already in wishlist for user: ${userId}`);
                return res.status(200).json({ message: "Product already in wishlist" });
            }

            wishlist.items.push({ productId });
            log.info(`Product ${productId} added to wishlist for user: ${userId}`);
        }

        await publishEventToExchange("wishlist.new", {
            userId: userId.toString(),
            productId: productId.toString(),
        });

        await wishlist.save();
        return res.status(200).json({ message: "Product added to wishlist successfully" });

    } catch (error) {
        log.error("Error adding to wishlist", error);
        return next(new ApiError("Failed to add product to wishlist", 500));
    }
};


export const removeFromWishlist = async (req, res, next) => {
    log.info("Remove from wishlist endpoint hit");

    try {
        const userId = req.userId;
        const productId = req.params.productId;

        if (!userId || !productId) {
            log.warn("Missing userId or productId in request");
            return next(new ApiError("User ID and Product ID are required", 400));
        }

        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            log.warn(`No wishlist found for user: ${userId}`);
            return next(new ApiError("Wishlist not found", 404));
        }

        const existingItemIndex = wishlist.items.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex === -1) {
            log.warn(`Product ${productId} not found in wishlist for user: ${userId}`);
            return res.status(404).json({ message: "Product not found in wishlist" });
        }
        // Remove the item from the wishlist
        wishlist.items.splice(existingItemIndex, 1);
        await wishlist.save();

        log.info(`Product ${productId} removed from wishlist for user: ${userId}`);

        await publishEventToExchange("wishlist.delete", {
            userId: userId.toString(),
            productId: productId.toString(),
        });

        return res.status(200).json({ message: "Product removed from wishlist successfully" });

    } catch (error) {
        log.error("Error removing from wishlist", error);
        return next(new ApiError("Failed to remove product from wishlist", 500));
    }
};


export const clearWishlist = async (req, res, next) => {
    log.info("Clear wishlist endpoint hit");

    try {
        const userId = req.userId;

        if (!userId) {
            log.warn("User ID is missing in request");
            return next(new ApiError("User ID is required", 400));
        }

        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            log.warn(`Wishlist not found for user: ${userId}`);
            return next(new ApiError("Wishlist not found", 404));
        }

        if (wishlist.items.length === 0) {
            log.info(`Wishlist is already empty for user: ${userId}`);
            return res.status(200).json({ message: "Wishlist is already empty" });
        }
        // Clear all items
        wishlist.items = [];
        await wishlist.save();

        log.info(`Wishlist cleared successfully for user: ${userId}`);

        await publishEventToExchange("wishlist.clear", {
            userId: userId.toString(),
            cleared: true,
        });

        
        return res.status(200).json({ message: "Wishlist cleared successfully" });

    } catch (error) {
        log.error("Error clearing wishlist", error);
        return next(new ApiError("Failed to clear wishlist", 500));
    }
};