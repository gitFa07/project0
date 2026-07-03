import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createConversation,
  getConversations,
  sendMessage,
  streamMessage,
  getConversation,
  renameConversation,
  deleteConversation,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/conversation", protect, createConversation);
router.get("/conversation", protect, getConversations);

router.post("/home", protect, sendMessage);
router.post("/stream", protect, streamMessage);

router.get("/conversation/:id", protect, getConversation);

router.put("/chat/:id", protect, renameConversation);
router.delete("/chat/:id", protect, deleteConversation);

export default router;
