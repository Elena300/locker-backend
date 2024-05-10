import dotenv from "dotenv";
import express, { json } from "express";
import mongoose from "mongoose";
import { UserModel } from "./models/User.js";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./Routes/userRoute.js";
import messageRoute from "./Routes/messageRoute.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error(err);
  });

const jwtSecret = process.env.JWT_SECRET;
const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL.endsWith("/")
      ? process.env.CLIENT_URL.slice(0, -1)
      : process.env.CLIENT_URL,
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json("Unauthorized");
  } else {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) {
        return res.status(401).json("Unauthorized");
      }
      res.status(200).json(userData);
    });
  }
  })

app.use("/", userRouter);
app.use("/user", messageRoute);

app.post("/login", async (req, res) => {
  const {username, password} = req.body;
  const foundUser = await UserModel.findOne({username: username});
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password)
    if (passOk) {
      jwt.sign({ userID: foundUser._id, username }, jwtSecret, {}, (err, token) => {
        res.cookie('token', token, {sameSite:'none', secure:true}).json({
          id: foundUser._id,
        })
      });
    }
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
