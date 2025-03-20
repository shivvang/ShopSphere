import express from "express";
import { cancelOrder, checkoutCart, setOrder } from "../controllers/order.controller.js";
import authenticatedRequest from "../middleware/authMiddleware.js";

const orderRouter = express.Router();
orderRouter.use(authenticatedRequest);

orderRouter.post("/add/:productId",setOrder);
orderRouter.post("/order/checkout",checkoutCart );
orderRouter.delete("/remove/:productId",cancelOrder);

export default orderRouter;