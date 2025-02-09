import { Customer } from "../database/Database.js";

export const handleProductDeletion = async(event)=>{
    log.info("Deleting product from  cart , wishlist , orders at Customers ", { event });

    try {
        const {productId} = event;

        if (!productId) {
            log.error("Product ID is missing in event");
            return;
        }

        //updateMany -> updates all the documents that matches this filter
        //pull remove elements 

        // Why $pull?
        // We don't know all product details in cart, wishlist, and orders, just the productId.
        // $pull removes entries where productId matches, making it perfect here

        await Customer.updateMany({
        },{
            $pull:{
                cart:{productId},
                wishlist:{productId},
                orders:{productId},
            }
        })

        log.info(`Product ${productId} removed from all customer records.`);

    } catch (error) {
        log.error("Error deleting product from cart, wishlist, orders", { error: error.message, stack: error.stack });
        throw new ApiError(500, "Internal Server Error");
    }
}

export const handleProductUpdation = async (event) => {
    log.info("Updating product in cart and wishlist", { event });

    try {
        const { productId, imageUrl, price } = event;

        if (!productId) {
            log.error("Product ID is missing in event");
            return;
        }

        const updates = {};
        if (price !== undefined) updates["cart.$[elem].price"] = price;
        if (imageUrl) updates["cart.$[elem].imageUrl"] = imageUrl;
        if (price !== undefined) updates["wishlist.$[elem].price"] = price;
        if (imageUrl) updates["wishlist.$[elem].imageUrl"] = imageUrl;

        const updateQuery = { $set: updates };
        const arrayFilters = [{ "elem.productId": productId }];

        // Update Cart and Wishlist
        await Customer.updateMany(
            { $or: [{ "cart.productId": productId }, { "wishlist.productId": productId }] },
            updateQuery,
            { arrayFilters }
        );

        log.info(`Product ${productId} updated successfully in Wishlist and Cart.`);
    } catch (error) {
        log.error("Error updating product in cart and wishlist", { error: error.message, stack: error.stack });
        throw new ApiError(500, "Internal Server Error");
    }
};