import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  createConversation,
  getConversations,
  sendMessage,
  streamMessage,
  getConversation,
  renameConversation,
  deleteConversation,
} from "../controllers/chatController.js";

import {
  sendMessageValidation,
  renameValidation,
  streamMessageValidation,
} from "../validators/chatValidator.js";

const router = express.Router();

router.post("/conversation", protect, createConversation);
router.get("/conversation", protect, getConversations);

router.post("/home", protect, sendMessageValidation, sendMessage);
router.post(
  "/stream",
  protect,
  upload.single("file"),
  streamMessageValidation,
  streamMessage,
);

router.get("/conversation/:id", protect, getConversation);

router.put("/chat/:id", protect, renameValidation, renameConversation);
router.delete("/chat/:id", protect, deleteConversation);

export default router;
