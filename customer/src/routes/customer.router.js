import express from "express";
import { customerCart, customerLogin, customerLogout, customerOrders, customerRegister, customerWishlist, deleteCustomer, resetPassword, resetToken } from "../controllers/customer.controller.js";
import verifyRefreshTokenMiddleware from "../middleware/verifyRefreshToken.js";
import validatetoken from "../middleware/authenticateUser.js";

const customerRouter = express.Router();


//auth 
customerRouter.post("/register", customerRegister); 
customerRouter.post("/login", customerLogin);  
customerRouter.post("/reset-token", verifyRefreshTokenMiddleware,resetToken); 
customerRouter.patch("/reset-password", verifyRefreshTokenMiddleware,resetPassword); 
customerRouter.post("/logout", verifyRefreshTokenMiddleware,customerLogout); 
customerRouter.delete("/delete", verifyRefreshTokenMiddleware, deleteCustomer);


//shopping
customerRouter.get("/wishlist", validatetoken,customerWishlist);
customerRouter.get("/cart",validatetoken, customerCart);
customerRouter.get("/orders", validatetoken,customerOrders);

export default customerRouter;