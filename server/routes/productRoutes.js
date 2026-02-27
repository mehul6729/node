import express from "express";
import multer from "multer";
import { userAuth } from "../middleware/userAuth.js";
import { handleUpload } from "../middleware/uploadProductImg.js";
import {
  addProduct,
  deleteImg,
  getProductDetails,
  getProducts,
  imgSave,
  updateProduct,
} from "../controllers/productController.js";

const productRoutes = express.Router();

productRoutes.post("/add", userAuth, addProduct);
productRoutes.get("/get/list", getProducts);
productRoutes.post("/update", userAuth, updateProduct);
productRoutes.get("/get/details/:id", userAuth, getProductDetails);
productRoutes.post("/img/save", userAuth, handleUpload, imgSave);
productRoutes.post("/img/delete", userAuth, deleteImg);

export default productRoutes;
