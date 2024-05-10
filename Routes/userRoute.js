import express from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";
import bcrypt from "bcrypt";

const salt = bcrypt.genSaltSync(10);

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json("Missing username or password");
  }
  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    return res.status(409).json("User already exists");
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, salt);
    const createUser = await UserModel.create({
        username: username, 
        password: hashedPassword,
     });
    const token = jwt.sign({ userID: createUser._id, username }, process.env.JWT_SECRET);
    res.status(201).cookie("token", token, {sameSite:'none', secure:true}).json({
      _id: createUser._id,
      maxAge: 3600000,
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json("User already exists");
    } else {
      res.status(500).json("Internal server error");
    }
  }
});

export default router;
