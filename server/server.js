import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

// API ENDPOINTS
app.get("/", (req, res) => res.send("API WORKING"));
app.use("/api/auth", authRouter);
app.use("/product", productRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.listen(port, () => console.log(`Server running on ${port}....`));

// todo list:
// 1) multiple admin can add there product (when product is added add user.id to the product to know which users product is this)
// 2) anyalisi for admin account
// 3) make a delivery flow as well (chat system )
// 4) ##### learn callbacks
