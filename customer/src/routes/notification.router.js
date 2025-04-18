import express from "express";
import validatetoken from "../middleware/authenticateUser.js";
import { fetchUnreadNotifications, markAsRead } from "../controllers/notification.controller.js";

const notificationRouter = express.Router();

notificationRouter.put("/read/:productId",validatetoken,markAsRead)
notificationRouter.get("/unRead/:userId", fetchUnreadNotifications)

export default notificationRouter;