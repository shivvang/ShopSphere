import Cart from "../database/models/Cart.model.js";
import { publishEventToExchange } from "../Queue/rabbitmq.js";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js"


export const addItemToCart = async (req, res, next) => {
    log.info("Add to cart endpoint hit");
    try {
        const userId = req.user;
        const productId = req.params.productId;
        let  { name, imageUrl, price, quantity = 1 ,brand} = req.body;

        if (!productId || !name || !imageUrl || !price || quantity <= 0 || !brand) {
            log.warn("Invalid input: Missing required fields or invalid quantity");
            return next(new ApiError("All fields are required and quantity must be greater than zero", 400));
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            log.info(`Creating a new cart for user: ${userId}`);
            cart = new Cart({
                userId,
                items: [{ productId, name, imageUrl, price, quantity,brand }]
            });
        } else {
            const existingItem = cart.items.find(item => item.productId.toString() === productId);

            if (existingItem) {
                log.info(`Updating quantity for product ${productId}`);
                quantity = existingItem.quantity + quantity
                existingItem.quantity = quantity;
            } else {
                log.info(`Adding new product ${productId} to cart`);
                cart.items.push({ productId, name, imageUrl, price, quantity,brand});
            }
        }

        await cart.save();
        await publishEventToExchange("cart.add", { userId, productId, quantity,name, imageUrl, price,brand});

        return res.status(200).json({ success: true, message: "Item added to cart successfully", cart });
    } catch (error) {
        log.error("Error adding item to cart", error);
        return next(new ApiError("Failed to add item to cart", 500));
    }
};


export const removeItemFromCart = async (req, res, next) => {
    log.info("Remove item from cart endpoint hit");
    try {
        const userId = req.user;
        const productId = req.params.productId;
        const { quantity } = req.body;

        if (!userId || !productId || quantity <= 0) {
            log.warn("Invalid input: Missing required fields or invalid quantity");
            return next(new ApiError("User ID, Product ID, and valid quantity are required", 400));
        }

        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            log.warn(`Cart not found or empty for user: ${userId}`);
            return next(new ApiError("Cart is empty", 404));
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (!existingItem) {
            log.warn(`Product ${productId} not found in cart`);
            return next(new ApiError("Product not found in cart", 404));
        }

        if (existingItem.quantity > quantity) {
            log.info(`Reducing quantity for product ${productId}`);
            existingItem.quantity -= quantity;
            await publishEventToExchange("cart.reduceQuantity", { userId, productId, quantity });
        } else {
            log.info(`Removing product ${productId} from cart`);
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            await publishEventToExchange("cart.reduceQuantity", { userId, productId ,quantity});
        }

        await cart.save();
        return res.status(200).json({success: true, message: "Item removed successfully", cart });
    } catch (error) {
        log.error("Error removing item from cart", error);
        return next(new ApiError("Failed to remove item from cart", 500));
    }
};

export const clearCart = async (req, res, next) => {
    log.info("Clear cart endpoint hit");
    try {
        const userId = req.user;
        if (!userId) {
            log.warn("User ID is missing in request");
            return next(new ApiError("User authentication required", 401));
        }

        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            log.info(`Cart is already empty for user: ${userId}`);
            return res.status(200).json({ message: "Cart is already empty" });
        }

        cart.items = [];
        await cart.save();

        log.info(`Cart cleared successfully for user: ${userId}`);
        await publishEventToExchange("cart.delete", { userId, all: true });

        return res.status(200).json({ success: true,message: "Cart cleared successfully" });
    } catch (error) {
        log.error("Error clearing the cart", error);
        return next(new ApiError("Failed to clear the cart", 500));
    }
};
