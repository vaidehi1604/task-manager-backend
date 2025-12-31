import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskById,
  getAdminTasks
} from "../controller/taskController.js";
import auth from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";
const router = express.Router();

router.post("/create",adminAuth, createTask);
router.get("/list",auth, getTasks);
router.get("/admin/list",adminAuth, getAdminTasks);
router.put("/:taskId",auth, updateTask);
router.delete("/:taskId",adminAuth, deleteTask);
router.get("/:taskId", auth, getTaskById);
export default router;
