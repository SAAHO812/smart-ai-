import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authRoute = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

authRoute.post('/login', async(req, res) => {
    const { email, password, role } = req.body;

//   const user = users.find(u => u.id === id && u.password === password && u.role===role);
try {
    const user = await User.findOne({ email, role });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid ID, password, or role" });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "72h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }

});

export default authRoute;
