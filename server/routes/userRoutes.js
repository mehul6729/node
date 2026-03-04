import express from "express";
import { placeOrder } from "../controllers/orderController.js";
import { userAuth } from "../middleware/userAuth.js";
import { addToCart, setCart, getUserDetails, updateProfile } from "../controllers/userController.js";
import { getMyOrders } from "../controllers/orderController.js";

const userRoutes = express.Router();
userRoutes.post("/create/order", userAuth, placeOrder);
userRoutes.put("/cart", userAuth, setCart);
userRoutes.get("/orders", userAuth, getMyOrders);
userRoutes.post("/cart", userAuth, addToCart);
userRoutes.get("/get/details", userAuth, getUserDetails);
userRoutes.put("/profile", userAuth, updateProfile);

export default userRoutes;
