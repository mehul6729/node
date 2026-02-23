import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import { addProduct, getProducts } from "../controllers/productController.js";

const productRoutes = express.Router();
productRoutes.post("/add", userAuth, addProduct);
productRoutes.get("/get/list", userAuth, getProducts);

export default productRoutes;
