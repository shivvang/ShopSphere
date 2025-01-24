import express from "express";
import { createProduct,deleteProduct,searchProducts, updateProduct } from "../controllers/product.controller.js";

const productRouter = express.Router();


productRouter.post("/createProduct",createProduct);
productRouter.post("/searchProducts",searchProducts);
productRouter.put("/updateProduct/:productId", updateProduct);
productRouter.delete("/deleteProduct/:productId",deleteProduct);

export default productRouter;