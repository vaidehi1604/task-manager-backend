import bcrypt from "bcryptjs";
import User from "../models/User.js"; // update path
import { ROLE } from "../config/constants.js";
async function createDefaultUsers() {
  const adminEmail = "admin@yopmail.com";
  const userEmail = "user@yopmail.com";

  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: await bcrypt.hash("Test@123", 10),
      roles: ROLE.ADMIN,
    });
    console.log("Default Admin Created!");
  }

  const userExists = await User.findOne({ email: userEmail });
  if (!userExists) {
    await User.create({
      name: "User",
      email: userEmail,
      password: await bcrypt.hash("Test@123", 10),
      roles: ROLE.USER,
    });
    console.log("Default User Created!");
  }
}
export default createDefaultUsers;
