import Cart from "../database/models/Cart.model.js";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js"


export const addItemToCart = async (req, res, next) => {
    log.info("Add to cart endpoint hit");
    try {
        const userId = req.userId;
        const { productId, quantity = 1} = req.body;

        if (!productId || quantity <= 0) {
            log.warn("Invalid product ID or quantity");
            return next(new ApiError("Product ID is required and quantity must be greater than zero", 400));
        }

        let cart = await Cart.findOne({ userId });

        // If cart doesn't exist, create a new one
        if (!cart) {
            log.info(`Creating a new cart for user: ${userId}`);
            cart = new Cart({
                userId,
                items: [{ productId, quantity }]
            });
        } else {
            // Check if product is already in the cart
            const existingItem = cart.items.find(item => item.productId.toString() === productId);

            if (existingItem) {
                log.info(`Product ${productId} already in cart, updating quantity`);
                existingItem.quantity += quantity;  // Increment quantity
            } else {
                log.info(`Adding new product ${productId} to cart`);
                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();
        return res.status(200).json({ success: true, message: "Item added to cart successfully", cart });

    } catch (error) {
        log.error("Error adding item to cart", error);
        return next(new ApiError("Failed to add item to cart", 500));
    }
};


export const removeItemFromCart = async (req, res, next) => {
    log.info("Remove item from cart endpoint hit");

    try {
        const userId = req.userId;
        const { productId, quantity = 1 } = req.body;

        // Validate userId and productId
        if (!userId || !productId) {
            log.warn("User ID or Product ID is missing in the request");
            return next(new ApiError("User ID and Product ID are required", 400));
        }

        // Find user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart || cart.items.length === 0) {
            log.warn(`Cart not found or empty for user: ${userId}`);
            return next(new ApiError("Cart is empty", 404));
        }

        // Find product in cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (!existingItem) {
            log.warn(`Product ${productId} not found in cart`);
            return next(new ApiError("Product not found in cart", 404));
        }

        // Reduce quantity or remove item
        if (existingItem.quantity > quantity) {
            log.info(`Reducing quantity of product ${productId} in cart`);
            existingItem.quantity -= quantity;
        } else {
            log.info(`Removing product ${productId} from cart`);
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        }

        await cart.save();

        log.info(`Successfully updated cart for user: ${userId}`);
        return res.status(200).json({ message: "Item removed successfully", cart });

    } catch (error) {
        log.error("Error removing item from cart", error);
        return next(new ApiError("Failed to remove item from cart", 500));
    }
};

export const clearCart = async (req, res, next) => {
    log.info("Clear cart endpoint hit");

    try {
        const userId = req.userId;

        if (!userId) {
            log.warn("User ID is missing in request");
            return next(new ApiError("User authentication required", 401));
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            log.warn(`No cart found for user: ${userId}`);
            return next(new ApiError("Cart not found", 404));
        }

        if (cart.items.length === 0) {
            log.info(`Cart is already empty for user: ${userId}`);
            return res.status(200).json({ message: "Cart is already empty" });
        }

        cart.items = [];
        await cart.save();

        log.info(`Cart cleared successfully for user: ${userId}`);
        return res.status(200).json({ message: "Cart cleared successfully" });

    } catch (error) {
        log.error("Error clearing the cart", error);
        return next(new ApiError("Failed to clear the cart", 500));
    }
};
