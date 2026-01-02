import mongoose from "mongoose";
import Task from "../models/Task.js";
import { TASK_STATUS, TASK_PRIORITY } from "../config/constants.js";
import User from "../models/User.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, category, priority, status, userId } = req.body;
    // const userId = req.user._id;

    const newTask = await Task.create({
      title: title.trim(),
      description,
      category,
      priority: priority || TASK_PRIORITY.MEDIUM,
      status: status || TASK_STATUS.PENDING,
      userId: userId,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Create Task Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, category, priority, page = 1, limit = 10 } = req.query;

    const filter = { userId };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Task.countDocuments(filter),
    ]);

    return res.status(200).json({
      total,
      tasks,
    });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAdminTasks = async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Task.countDocuments(filter),
    ]);

    return res.status(200).json({
      total,
      tasks,
    });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
   
    const { title, description, category, priority, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (priority) updateData.priority = priority;
    if (status) updateData.status = status;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      updateData,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("❌ Update Task Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      userId,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Task Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
   

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({
      task,
    });
  } catch (error) {
    console.error("Get Task By ID Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAdminDashboardStats = async (req, res) => {
  try {


    // Collect statistics in parallel for speed
    const [
      totalTasks,
      totalUsers,
      tasksByStatus,
      tasksByPriority,
      tasksByCategory,
      latestTasks
    ] = await Promise.all([
      Task.countDocuments(),
      User.countDocuments(),
      Task.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]),
      Task.find().sort({ createdAt: -1 }).limit(5)
    ]);

    return res.status(200).json({
      success: true,
      dashboard: {
        totals: {
          tasks: totalTasks,
          users: totalUsers
        },
        breakdowns: {
          byStatus: tasksByStatus,
          byPriority: tasksByPriority,
          byCategory: tasksByCategory
        },
        recentTasks: latestTasks
      }
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};