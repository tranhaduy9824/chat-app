const messageModel = require("../models/messageModel");
const cloudinary = require("../config/cloudinaryConfig");

const createMessage = async (req, res) => {
  const senderId = req.userData._id;
  const { chatId, text } = req.body;
  const file = req.file;

  let fileUrl = "";
  let fileType = "text";

  try {
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
      });

      fileUrl = uploadResult.secure_url;
      fileType =
        uploadResult.resource_type === "image"
          ? "image"
          : uploadResult.resource_type === "video"
          ? "video"
          : "file";
    }

    const message = new messageModel({
      chatId,
      senderId,
      text: text || "",
      mediaUrl: fileUrl,
      type: fileType,
    });

    const response = await message.save();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const messages = await messageModel
      .find({ chatId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalMessages = await messageModel.countDocuments({ chatId });

    return res.status(200).json({
      messages,
      hasMore: totalMessages > page * limit,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const reactToMessage = async (req, res) => {
  const { messageId } = req.params;
  const { userId, reaction } = req.body;

  try {
    const message = await messageModel.findById(messageId);

    if (!message) return res.status(404).json("Message not found");

    const existingReaction = message.reactions.find(
      (r) => r.userId.toString() === userId
    );

    if (existingReaction) {
      existingReaction.reaction = reaction;
    } else {
      message.reactions.push({ userId, reaction });
    }

    await message.save();
    return res.status(200).json({ message: "Reaction updated", message });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const replyToMessage = async (req, res) => {
  const { messageId } = req.params;
  const { userId, text, media, type } = req.body;

  try {
    const originalMessage = await messageModel.findById(messageId);

    if (!originalMessage)
      return res.status(404).json("Original message not found");

    const newMessage = new messageModel({
      chatId: originalMessage.chatId,
      senderId: userId,
      text: text || "",
      media: media || "",
      type: type || "text",
      replyTo: messageId,
    });

    await newMessage.save();
    return res.status(200).json({ message: "Reply sent", newMessage });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const deleteMessage = async (req, res) => {
  const messageId = req.params.messageId;

  try {
    await messageModel.findByIdAndDelete(messageId);

    return res.status(200).json("Message deleted");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

module.exports = {
  createMessage,
  getMessages,
  reactToMessage,
  replyToMessage,
  deleteMessage,
};
