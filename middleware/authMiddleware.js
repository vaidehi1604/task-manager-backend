import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  let token;

  // 1️⃣ Check Authorization header
  if (req.headers.authorization) {
    if (req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      token = req.headers.authorization; // raw token
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { _id: decoded._id || decoded.id }; // support both
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default protect;
