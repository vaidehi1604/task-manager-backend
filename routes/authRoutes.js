import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  changePassword
} from "../controller/authController.js";
import auth from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", auth, logoutUser);
router.get("/user/list", adminAuth, getUser);
router.put("/change-password", auth, changePassword);


export default router;
