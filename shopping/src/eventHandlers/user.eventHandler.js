import { Cart,Wishlist,Order } from "../database/Database.js"; 

export const handleUserDeletion = async (event) => {
    log.info("Deleting user from cart, wishlist, and orders at Shopping", { event });

    try {
        const { userId } = event;

        if (!userId) {
            log.error("userId is missing in event");
            return;
        }

        // Delete user's wishlist, cart, and orders

        await Wishlist.deleteOne({ userId });

        await Cart.deleteOne({ userId });

        await Order.deleteOne({ userId });

        log.info(`User ${userId} removed from all wishlist, order, and cart records.`);
        
    } catch (error) {
        log.error("Error deleting user from cart, wishlist, and orders at Shopping", { error: error.message, stack: error.stack });
        throw new ApiError(500, "Internal Server Error");
    }
};