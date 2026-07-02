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

router.post("/api/chat/conversation", protect, createConversation);
router.get("/api/chat/conversation", protect, getConversations);
router.post("/api/chat/home", protect, sendMessage);
router.post("/api/chat/stream", protect, streamMessage);
router.get("/api/chat/conversation/:id", protect, getConversation);
router.put("/api/chat/chat/:id", protect, renameConversation);
router.delete("/chat/:id", protect, deleteConversation);

export default router;
