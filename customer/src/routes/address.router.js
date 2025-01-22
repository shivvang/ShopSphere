import express from "express";
import verifyRefreshTokenMiddleware from "../middleware/verifyRefreshToken.js";
import { addAddress, deleteAddress, findAllAddresses, removeDefaultAddress, setDefaultAddress } from "../controllers/address.controller.js";

const addressRouter = express.Router();

addressRouter.post("/",verifyRefreshTokenMiddleware, addAddress);
addressRouter.get("/",verifyRefreshTokenMiddleware, findAllAddresses);
addressRouter.post("/default/:addressId",verifyRefreshTokenMiddleware,setDefaultAddress);
addressRouter.delete("/default/:addressId",verifyRefreshTokenMiddleware,removeDefaultAddress )
addressRouter.delete("/:addressId", verifyRefreshTokenMiddleware, deleteAddress);



export default addressRouter;