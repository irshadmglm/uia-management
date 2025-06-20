import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import bookRoutes from "./routes/book.route.js";
import userRoutes from "./routes/user.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import admissionRoutes from "./routes/admission.route.js";
import managementRoutes from "./routes/management.route.js";
import marksRoutes from "./routes/marks.route.js";
import feesRoutes from "./routes/fees.route.js";
import achivemnetRoutes from "./routes/achivement.route.js"
import readingProgressRoutes from "./routes/readingProgress.route.js"

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:4173", 
    "http://192.168.1.7:5173",
    "https://uia-management.vercel.app",
    "https://uia-app.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admission', admissionRoutes);
app.use('/api/mng', managementRoutes);
app.use('/api/marklist', marksRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/achievements', achivemnetRoutes);
app.use('/api/reading-progress', readingProgressRoutes);

app.get("/api/ping", (req, res) => {
  res.status(200).send("Server is alive!");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}




app.listen(PORT, () => {
  console.log("Server running on PORT:", PORT);
  connectDB();
});
