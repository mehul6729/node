import express from "express";
import { placeOrder } from "../controllers/orderController.js";
import { userAuth } from "../middleware/userAuth.js";
import { addToCart, getUserDetails } from "../controllers/userController.js";

const userRoutes = express.Router();
userRoutes.post("/create/order", userAuth, placeOrder);
userRoutes.post("/cart", userAuth, addToCart);
userRoutes.get("/get/details", userAuth, getUserDetails);

export default userRoutes;
