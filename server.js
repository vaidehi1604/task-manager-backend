import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import createDefaultUsers from "./helper/createDefaultAdmin.js";

dotenv.config();
connectDB();

// create default admin and user
createDefaultUsers().catch(console.error);

const app = express();

const allowedOrigins = [
  "https://task-manager-flame-one.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Backend is running 🎉" });
});

app.use("/api/auth", authRoutes);
app.use("/task", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
