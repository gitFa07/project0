import Conversation from "../models/Conversations.js";

export const generateConversationTitle = (message) => {
  return message.length > 40 ? message.substring(0, 40) + "..." : message;
};

export const findUserConversation = async (conversationId, userId) => {
  return await Conversation.findOne({
    _id: conversationId,
    userId,
  });
};

export const conversationNotFound = (res) => {
  return res.status(404).json({
    success: false,
    message: "Conversation not found",
  });
};
