import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import {
  addProduct,
  getProductDetails,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";

const productRoutes = express.Router();
productRoutes.post("/add", userAuth, addProduct);
productRoutes.get("/get/list", getProducts);
productRoutes.post("/update", userAuth, updateProduct);
productRoutes.get("/get/details/:id", userAuth, getProductDetails);

export default productRoutes;
