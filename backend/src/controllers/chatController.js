import Conversation from "../models/Conversations.js";
import ai from "../utils/gemini.js";
import {
  findUserConversation,
  conversationNotFound,
  generateConversationTitle,
} from "../utils/conversationHelpers.js";

export const createConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.create({
      userId: req.user._id,
      title: "New Chat",
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(err);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { chatId, message } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({
        success: false,
        error: "chatId and message are required",
      });
    }

    const conversation = await findUserConversation(chatId, req.user._id);

    if (!conversation) {
      return conversationNotFound(res);
    }

    conversation.messages.push({
      role: "user",
      text: message,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    const reply = response.text;

    conversation.messages.push({
      role: "assistant",
      text: reply,
    });

    if (
      conversation.title === "New Chat" &&
      conversation.messages.length === 2
    ) {
      conversation.title = generateConversationTitle(message);
    }

    await conversation.save();

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    next(err);
  }
};

export const streamMessage = async (req, res, next) => {
  try {
    const { chatId, message } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({
        success: false,
        error: "chatId and message are required",
      });
    }

    const conversation = await findUserConversation(chatId, req.user._id);

    if (!conversation) {
      return conversationNotFound(res);
    }

    // Save user message
    conversation.messages.push({
      role: "user",
      text: message,
    });

    // Important headers
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    let fullReply = "";

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: message,
    });

    for await (const chunk of stream) {
      const text = chunk.text;

      if (text) {
        fullReply += text;
        res.write(text);
      }
    }

    conversation.messages.push({
      role: "assistant",
      text: fullReply,
    });

    if (
      conversation.title === "New Chat" &&
      conversation.messages.length === 2
    ) {
      conversation.title = generateConversationTitle(message);
    }

    await conversation.save();

    res.end();
  } catch (err) {
    next(err);
  }
};

export const getConversation = async (req, res, next) => {
  try {
    const conversation = await findUserConversation(
      req.params.id,
      req.user._id,
    );

    if (!conversation) {
      return conversationNotFound(res);
    }

    res.json({
      success: true,
      conversation,
    });
  } catch (err) {
    next(err);
  }
};

export const renameConversation = async (req, res, next) => {
  try {
    const { title } = req.body;

    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      {
        title,
      },
      {
        new: true,
      },
    );

    if (!conversation) {
      return conversationNotFound(res);
    }

    res.json({
      success: true,
      conversation,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteConversation = async (req, res, next) => {
  try {
    const deletedConversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deletedConversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
