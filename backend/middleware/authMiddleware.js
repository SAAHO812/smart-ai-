import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import User from "../models/userModel.js"
dotenv.config();
const JWT_SECRET = process.env.SECRET_KEY;

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Bearer token missing" });
  }
  const token = authHeader.split(" ")[1];
  // console.log(token);
  // console.log(JWT_SECRET);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { _id, role } = decoded;
    const user = await User.findOne({ _id, role });
    if (!user) {
      return res.status(401).json({ message: "Invalid user or role mismatch" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};