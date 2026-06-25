import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import connectDB from "./config/db.js";
import Conversation from "./models/Conversations.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Create a new conversation
app.post("/conversation", async (req, res) => {
  try {
    const conversation = await Conversation.create({
      title: "New Chat",
      messages: [],
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all conversations (for sidebar later)
app.get("/conversation", async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({
      updatedAt: -1,
    });

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// // Send message to Gemini
// app.post("/home", async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).json({
//         success: false,
//         error: "Message is required",
//       });
//     }

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: message,
//     });

//     const reply = response.text;

//     return res.json({
//       success: true,
//       reply,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       error: "Internal Server Error",
//     });
//   }
// });

// Send message and save it in the conversation
app.post("/home", async (req, res) => {
  try {
    const { chatId, message } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({
        success: false,
        error: "chatId and message are required",
      });
    }

    // Find conversation
    const conversation = await Conversation.findById(chatId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found",
      });
    }

    // Save user message
    conversation.messages.push({
      role: "user",
      text: message,
    });

    // Ask Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    const reply = response.text;

    // Save AI message
    conversation.messages.push({
      role: "assistant",
      text: reply,
    });

    // Rename conversation using the first user message
    if (
      conversation.title === "New Chat" &&
      conversation.messages.length === 2
    ) {
      conversation.title =
        message.length > 40 ? message.substring(0, 40) + "..." : message;
    }

    await conversation.save();

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
