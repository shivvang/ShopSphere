import express from "express";
import { customerLogin, customerLogout, customerRegister, deleteCustomer, resetPassword, resetToken } from "../controllers/customer.controller.js";
import verifyRefreshTokenMiddleware from "../middleware/verifyRefreshToken.js";

const customerRouter = express.Router();


//auth 
customerRouter.post("/register", customerRegister); 
customerRouter.post("/login", customerLogin);  
customerRouter.post("/reset-token", verifyRefreshTokenMiddleware,resetToken); 
customerRouter.patch("/reset-password", verifyRefreshTokenMiddleware,resetPassword); 
customerRouter.post("/logout", verifyRefreshTokenMiddleware,customerLogout); 
customerRouter.delete("/delete", verifyRefreshTokenMiddleware, deleteCustomer);


export default customerRouter;