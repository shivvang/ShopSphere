import express from "express";
import { setOrder } from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.post("/",setOrder);
orderRouter.delete("/:productId",cancelOrder);

export default orderRouter;