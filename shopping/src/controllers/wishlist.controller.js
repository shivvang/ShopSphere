import Wishlist from "../database/models/Wishlist.model.js";
import { publishEventToExchange } from "../Queue/rabbitmq.js";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js"

export const addToWishlist = async (req, res, next) => {
    log.info("Received request to add product to wishlist");

    try {
        const userId = req.user;
        const productId = req.params.productId;
        const { name, imageUrl, price } = req.body;

        if (!userId || !productId) {
            log.warn("User ID or Product ID is missing from request");
            return next(new ApiError("User ID and Product ID are required", 400));
        }

        if (!name || !imageUrl || !price) {
            log.warn("Product details are missing from request body");
            return next(new ApiError("Product name, image URL, and price are required", 400));
        }

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            log.info(`Creating a new wishlist for user: ${userId}`);
            wishlist = new Wishlist({ userId, items: [{ productId, name, imageUrl, price }] });
        } else {
            const productExists = wishlist.items.some(item => item.productId.toString() === productId);

            if (productExists) {
                log.info(`Product ${productId} is already in the wishlist for user: ${userId}`);
                return res.status(200).json({ message: "Product is already in your wishlist" });
            }

            wishlist.items.push({ productId, name, imageUrl, price });
            log.info(`Added product ${productId} to wishlist for user: ${userId}`);
        }

        await publishEventToExchange("wishlist.itemAdded", { userId,productId,name, imageUrl, price});
        await wishlist.save();
        return res.status(201).json({ message: "Product successfully added to wishlist" });
    } catch (error) {
        log.error("Error adding product to wishlist", error);
        return next(new ApiError("Unable to add product to wishlist. Please try again later.", 500));
    }
};


export const removeFromWishlist = async (req, res, next) => {
    log.info("Received request to remove product from wishlist");

    try {
        const userId = req.user;
        const productId = req.params.productId;

        if (!userId || !productId) {
            log.warn("User ID or Product ID is missing from request");
            return next(new ApiError("User ID and Product ID are required", 400));
        }

        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist || wishlist.items.length === 0) {
            log.warn(`No wishlist found for user: ${userId}`);
            return next(new ApiError("No wishlist found for this user", 404));
        }

        const initialItemCount = wishlist.items.length;
        wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);

        if (wishlist.items.length === initialItemCount) {
            log.warn(`Product ${productId} not found in wishlist for user: ${userId}`);
            return res.status(404).json({ message: "Product not found in wishlist" });
        }

        await wishlist.save();
        log.info(`Removed product ${productId} from wishlist for user: ${userId}`);
        await publishEventToExchange("wishlist.itemRemoved", { userId: userId.toString(), productId: productId.toString() });

        return res.status(200).json({ message: "Product successfully removed from wishlist" });
    } catch (error) {
        log.error("Error removing product from wishlist", error);
        return next(new ApiError("Unable to remove product from wishlist. Please try again later.", 500));
    }
};



export const clearWishlist = async (req, res, next) => {
    log.info("Received request to clear wishlist");

    try {
        const userId = req.user;

        if (!userId) {
            log.warn("User ID is missing from request");
            return next(new ApiError("User ID is required", 400));
        }

        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist || wishlist.items.length === 0) {
            log.info(`Wishlist is already empty for user: ${userId}`);
            return res.status(200).json({ message: "Your wishlist is already empty" });
        }

        wishlist.items = [];
        await wishlist.save();

        log.info(`Wishlist successfully cleared for user: ${userId}`);
        await publishEventToExchange("wishlist.cleared", { userId: userId.toString(), cleared: true });

        return res.status(200).json({ message: "Wishlist cleared successfully" });
    } catch (error) {
        log.error("Error clearing wishlist", error);
        return next(new ApiError("Unable to clear wishlist. Please try again later.", 500));
    }
};