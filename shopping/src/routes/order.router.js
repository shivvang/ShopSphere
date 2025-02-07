import express from "express";
import { cancelOrder, setOrder } from "../controllers/order.controller.js";
import authenticatedRequest from "../middleware/authMiddleware.js";

const orderRouter = express.Router();
orderRouter.use(authenticatedRequest);

orderRouter.post("/add/:productId",setOrder);
orderRouter.delete("/remove/:productId",cancelOrder);

export default orderRouter;