import express from "express";
import { createProduct,deleteProduct,uploadFileAndGetUrl,searchProducts, updateProduct } from "../controllers/product.controller.js";
import authenticatedRequest from "../middleware/authMiddleware.js";
const productRouter = express.Router();

// productRouter.use(authenticatedRequest);

import multer from "multer";
const upload = multer({storage: multer.memoryStorage()});
//files stored in memoryStorage() remain in memory until the request is completed

productRouter.post("/createProduct",createProduct);
productRouter.post("/searchProducts",searchProducts);
productRouter.post("/file/upload",upload.single("file"),uploadFileAndGetUrl);
productRouter.put("/updateProduct/:productId", updateProduct);
productRouter.delete("/deleteProduct/:productId",deleteProduct);
export default productRouter;