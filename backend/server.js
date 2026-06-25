import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import connectDB from "./config/db.js";
import Chat from "./models/chats.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/home", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    // Save user message
    await Chat.create({
      text: message,
      sender: "user",
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    const reply = response.text;

    console.log("AI Reply:", reply);

    await Chat.create({
      text: reply,
      sender: "AI",
    });

    return res.json({
      success: true,
      reply,
    });

    res.json({
      success: true,
      reply: response.text,
    });
  } catch (error) {
    console.error(error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }
});

app.get("/chats", async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: 1 });

    res.json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch chats",
    });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
