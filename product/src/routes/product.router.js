import express from "express";
import { createProduct,deleteProduct,uploadFileAndGetUrl,searchProducts, updateProduct, removeImageFromAWS } from "../controllers/product.controller.js";
const productRouter = express.Router();



import multer from "multer";
import verifyAccessTokenMiddleware from "../middleware/verifyAccessToken.js";
const upload = multer({storage: multer.memoryStorage()});
//files stored in memoryStorage() remain in memory until the request is completed



// Product Management 
productRouter.post("/createProduct",verifyAccessTokenMiddleware,createProduct);
productRouter.post("/searchProducts",searchProducts);
productRouter.post("/file/upload",verifyAccessTokenMiddleware,upload.single("file"),uploadFileAndGetUrl);
productRouter.put("/updateProduct/:productId", verifyAccessTokenMiddleware,updateProduct);
productRouter.delete("/deleteProduct/:productId",verifyAccessTokenMiddleware,deleteProduct);
productRouter.delete("/image/remove",verifyAccessTokenMiddleware,removeImageFromAWS);

export default productRouter;