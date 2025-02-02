import express from "express";
import { createProduct,deleteProduct,searchProducts, updateProduct } from "../controllers/product.controller.js";
import authenticatedRequest from "../middleware/authMiddleware.js";

const productRouter = express.Router();

productRouter.use(authenticatedRequest);

productRouter.post("/createProduct",createProduct);
productRouter.post("/searchProducts",searchProducts);
productRouter.put("/updateProduct/:productId", updateProduct);
productRouter.delete("/deleteProduct/:productId",deleteProduct);

export default productRouter;