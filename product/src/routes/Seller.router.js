import express from "express";
import { associateProductWithSeller, deleteSeller, disassociateProductFromSeller, getSellerProducts, loginSeller, logoutSeller, refreshToken, registerSeller, resetPassword } from "../controllers/seller.controller.js";
import verifyAccessTokenMiddleware from "../middleware/verifyAccessToken.js";
import verifyRefreshToken from "../middleware/verifyRefreshToken.js";

const SellerRouter = express.Router();


SellerRouter.post("/register",registerSeller);
SellerRouter.post("/login",loginSeller);
SellerRouter.post("/token",verifyRefreshToken, refreshToken);
SellerRouter.post("/logout", logoutSeller);
SellerRouter.post("/associateProduct/:productId",verifyAccessTokenMiddleware,associateProductWithSeller)
SellerRouter.delete("/disassociateProduct/:productId",verifyAccessTokenMiddleware,disassociateProductFromSeller)
SellerRouter.post("/reset-password",verifyAccessTokenMiddleware, resetPassword);
SellerRouter.post("/my-products",verifyAccessTokenMiddleware,getSellerProducts)
SellerRouter.delete("/delete",verifyAccessTokenMiddleware, deleteSeller);

export default SellerRouter;