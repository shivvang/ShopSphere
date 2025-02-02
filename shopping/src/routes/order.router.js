import express from "express";
import { setOrder } from "../controllers/order.controller.js";
import authenticatedRequest from "../middleware/authMiddleware.js";

const orderRouter = express.Router();
orderRouter.use(authenticatedRequest);

orderRouter.post("/",setOrder);
orderRouter.delete("/:productId",cancelOrder);

export default orderRouter;