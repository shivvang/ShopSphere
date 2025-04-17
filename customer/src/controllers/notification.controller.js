import { Notification } from "../database/Database.js";
import { ApiError } from "../utils/ApiError.js";
import log from "../utils/logHandler.js";

export const markAsRead = async (req, res, next) => {
    log.info("Mark notification as read endpoint hit...");
  
    try {
      const { productId } = req.params;
      const userId = req.userId;
  
      if (!userId || !productId) {
        log.error("Missing userId or productId in request.");
        return next(new ApiError(400, "Missing user or product information."));
      }
  
      const notification = await Notification.findOne({ customerId: userId, productId });
  
      if (!notification) {
        log.warn(`Notification not found for productId: ${productId}, userId: ${userId}`);
        return next(new ApiError(404, "Notification not found."));
      }
  
      if (notification.isRead) {
        return res.status(200).json({ success: true, message: "Notification already marked as read." });
      }
  
      notification.isRead = true;
      await notification.save();
  
      return res.status(200).json({ success: true, message: "Notification marked as read." });
  
    } catch (error) {
      log.error("Error marking notification as read", error);
      return next(new ApiError(500, "Failed to mark notification as read.", error));
    }
  };

  export const fetchUnreadNotifications = async (req, res, next) => {
    log.info("Fetch unread notifications endpoint hit...");
  
    try {
      const { userId } = req.params;
  
      if (!userId) {
        log.error("Missing userId in request params.");
        return next(new ApiError(400, "User ID is required."));
      }
  
      const unreadNotifications = await Notification.find({ customerId: userId, isRead: false });
  
      if (unreadNotifications.length === 0) {
        return res.status(200).json({ success: true, message: "All notifications have been read." });
      }
  
      return res.status(200).json({ success: true, unreadNotifications });
  
    } catch (error) {
      log.error("Error fetching unread notifications", error);
      return next(new ApiError(500, "Failed to fetch unread notifications.", error));
    }
  };