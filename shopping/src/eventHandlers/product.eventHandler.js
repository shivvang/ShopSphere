import { Cart,Wishlist,Order } from "../database/Database.js"; 

export const handleProductDeletion = async (event) => {
    log.info("Deleting product from cart, wishlist, and orders at Shopping", { event });

    try {
        const { productId } = event;

        if (!productId) {
            log.error("Product ID is missing in event");
            return;
        }

        // Remove product from all wishlists
        await Wishlist.updateMany(
            { "items.productId": productId },
            { $pull: { items: { productId } } }
        );

        // Remove product from all carts
        await Cart.updateMany(
            { "items.productId": productId },
            { $pull: { items: { productId } } }
        );

        // Remove product from all orders
        await Order.updateMany(
            { "items.productId": productId },
            { $pull: { items: { productId } } }
        );

        log.info(`Product ${productId} removed from all wishlist, order, and cart records.`);

    } catch (error) {
        log.error("Error deleting product from cart, wishlist, and orders at Shopping", { error: error.message, stack: error.stack });
        throw new ApiError(500, "Internal Server Error");
    }
};

export const handleProductUpdation = async (event) => {
    log.info("Updating product in cart and wishlist", { event });

    try {
        const { productId, imageUrl, price } = event;

        if (!productId) {
            log.error("Product ID is missing in event");
            return;
        }

        const updates = {};
        if (price !== undefined) updates["items.$[elem].price"] = price;
        if (imageUrl) updates["items.$[elem].imageUrl"] = imageUrl;

       // "$[elem]" is a placeholder for the item inside the array that matches the condition we define later.
        const updateQuery = {
            $set: updates,
        };

        const arrayFilters = [{ "elem.productId": productId }];

        // Update Wishlist
        await Wishlist.updateMany(
            { "items.productId": productId },
            updateQuery,
            { arrayFilters }
        );

        // Update Cart
        await Cart.updateMany(
            { "items.productId": productId },
            updateQuery,
            { arrayFilters }
        );

        log.info(`Product ${productId} updated successfully in Wishlist and Cart.`);

    } catch (error) {
        log.error("Error updating product in cart and wishlist", { error: error.message, stack: error.stack });
        throw new ApiError(500, "Internal Server Error");
    }
};