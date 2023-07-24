
import express from "express";
import authRouter from "./routers/auth";
import productRouter from "./routers/product";
import mongoose from "mongoose";
const app = express();
import cors from "cors"
import categoryRouter from "./routers/category";


// đăng ký middleware" giải mã dữ liệu json
app.use(express.json());
app.use(cors())

// router
app.use("/api", productRouter);
app.use("/api", authRouter);
app.use("/api", categoryRouter)

mongoose.connect("mongodb://127.0.0.1:27017/BE17302");

export const viteNodeApp = app;