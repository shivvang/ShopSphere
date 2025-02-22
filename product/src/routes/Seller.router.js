import express from "express";
import { deleteSeller, loginSeller, logoutSeller, refreshToken, registerSeller, resetPassword } from "../controllers/seller.controller.js";
import verifyRefreshTokenMiddleware from "../middleware/verifyRefreshToken.js";

const SellerRouter = express.Router();


SellerRouter.post("/register",registerSeller);
SellerRouter.post("/login",loginSeller);
SellerRouter.post("/token",verifyRefreshTokenMiddleware, refreshToken);
SellerRouter.post("/logout",verifyRefreshTokenMiddleware, logoutSeller);
SellerRouter.post("/reset-password",verifyRefreshTokenMiddleware, resetPassword);
SellerRouter.delete("/delete",verifyRefreshTokenMiddleware, deleteSeller);

export default SellerRouter;