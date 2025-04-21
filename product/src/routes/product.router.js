import express from "express";
import { createProduct,deleteProduct,uploadFileAndGetUrl,searchProducts, updateProduct, removeImageFromAWS, getLatestProducts, getRandomProducts, flashSaleProducts, getProduct } from "../controllers/product.controller.js";
const productRouter = express.Router();
import verifyAccessTokenMiddleware from "../middleware/verifyAccessToken.js";
import { upload } from "../middleware/multer.middleware.js";





// Product Management 
productRouter.post("/createProduct",verifyAccessTokenMiddleware,createProduct);
productRouter.post("/searchProducts",searchProducts);
productRouter.get("/latestProducts", getLatestProducts);
productRouter.get("/randomProducts/:noOfProduct", getRandomProducts);
productRouter.get("/DiscountedProducts", flashSaleProducts);
productRouter.get("/:productId",getProduct);
productRouter.post("/file/upload",upload.single("file"),verifyAccessTokenMiddleware,uploadFileAndGetUrl);
productRouter.put("/updateProduct/:productId", verifyAccessTokenMiddleware,updateProduct);
productRouter.delete("/deleteProduct/:productId",verifyAccessTokenMiddleware,deleteProduct);
productRouter.delete("/image/remove",verifyAccessTokenMiddleware,removeImageFromAWS);

export default productRouter;