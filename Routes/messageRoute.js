import express from "express";
import Message from "../models/Message.js"
const router = express.Router();

router.post('/sendmessage/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;
  const { message } = req.body;

  try {
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();

    res.json({ senderId, receiverId, message });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
export default router;