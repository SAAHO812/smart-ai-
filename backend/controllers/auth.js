import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authRoute = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

authRoute.post('/register', async (req, res) => {
    const { name, email, password, role, subjects } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = new User({ name, email, password, role, subjects });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

authRoute.post('/login', async(req, res) => {
    const { email, password, role } = req.body;
    console.log(`Login attempt: email=${email}, role=${role}`);

try {
    const user = await User.findOne({ email, role });
    if (!user) console.log("User not found in DB");
    else if (user.password !== password) console.log("Invalid password provided");

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
