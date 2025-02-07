import express from "express";
import { addItemToCart, clearCart, removeItemFromCart } from "../controllers/cart.controller.js";
import authenticatedRequest from "../middleware/authMiddleware.js";

const cartRouter = express.Router();
cartRouter.use(authenticatedRequest);

cartRouter.post("/add/:productId", addItemToCart);
cartRouter.post("/remove/:productId", removeItemFromCart);
cartRouter.put("/clear", clearCart);

export default cartRouter