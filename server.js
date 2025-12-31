import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import createDefaultUsers from "./helper/createDefaultAdmin.js";

dotenv.config();
connectDB();
createDefaultUsers().catch(console.error);

const app = express();

// 🌍 Allowed origins (Frontend URLs)
const allowedOrigins = [
  "https://task-manager-flame-one.vercel.app", // YOUR VERCEL FRONTEND
  "http://localhost:5173",                     // LOCAL DEV
];

// 🛑 CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// 🧩 API Routes
app.use("/api/auth", authRoutes);
app.use("/task", taskRoutes);

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
