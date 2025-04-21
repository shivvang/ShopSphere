import express from "express";
import validatetoken from "../middleware/authenticateUser.js";
import { fetchUnreadNotifications, markAsRead, markBulkAsRead } from "../controllers/notification.controller.js";

const notificationRouter = express.Router();

notificationRouter.put("/read/:productId",validatetoken,markAsRead)
notificationRouter.put("/readBulk/:orderId",validatetoken,markBulkAsRead)
notificationRouter.get("/unRead/:userId", fetchUnreadNotifications)

export default notificationRouter;