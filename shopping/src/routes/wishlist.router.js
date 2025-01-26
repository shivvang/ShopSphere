import express from "express";
import { addToWishlist, clearWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";


const wishlistRouter = express.Router();


wishlistRouter.post("/add/:productId", addToWishlist);
wishlistRouter.delete("/remove/:productId", removeFromWishlist);
wishlistRouter.delete("/clear", clearWishlist);

export default wishlistRouter;  