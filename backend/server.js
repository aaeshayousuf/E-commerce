import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
dotenv.config();
// import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import uploadRouter from "./routes/uploadRoute.js";
import orderRouter from "./routes/orderRoutes.js"
import path from "path";
import cors from "cors";

import {connectDB} from "./config/db.js";

connectDB();
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
// app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/upload", uploadRouter);
app.use('/api/order', orderRouter);
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname + 'uploads')))

app.use("*", (req, res) => {
  res.status(404).json({
    message: "not found",
    success: false,
  });
});

app.listen(port, console.log(`server is running on port ${port}`));