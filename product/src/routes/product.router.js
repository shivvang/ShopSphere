import express from "express";
import { createProduct,deleteProduct,uploadFileAndGetUrl,searchProducts, updateProduct, removeImageFromAWS } from "../controllers/product.controller.js";
const productRouter = express.Router();
import verifyAccessTokenMiddleware from "../middleware/verifyAccessToken.js";
import { upload } from "../middleware/multer.middleware.js";





// Product Management 
productRouter.post("/createProduct",verifyAccessTokenMiddleware,createProduct);
productRouter.post("/searchProducts",searchProducts);
productRouter.post("/file/upload",upload.single("file"),uploadFileAndGetUrl);
productRouter.put("/updateProduct/:productId", verifyAccessTokenMiddleware,updateProduct);
productRouter.delete("/deleteProduct/:productId",verifyAccessTokenMiddleware,deleteProduct);
productRouter.delete("/image/remove",verifyAccessTokenMiddleware,removeImageFromAWS);

export default productRouter;