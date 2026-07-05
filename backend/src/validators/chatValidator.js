import { body, validationResult } from "express-validator";

export const sendMessageValidation = [
  body("chatId").notEmpty().withMessage("Chat ID is required"),

  body("message").trim().notEmpty().withMessage("Message cannot be empty"),

  handleValidationErrors,
];

export const renameValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 60 })
    .withMessage("Title must be under 60 characters"),

  handleValidationErrors,
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
}

export const streamMessageValidation = [
  body("chatId").notEmpty().withMessage("Chat ID is required"),

  body("message").trim().notEmpty().withMessage("Message cannot be empty"),

  handleValidationErrors,
];
