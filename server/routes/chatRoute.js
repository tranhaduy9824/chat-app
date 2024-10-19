const express = require("express");
const {
  createChat,
  findUserChats,
  findChat,
  pinMessage,
  unpinMessage,
  getPinnedMessages,
} = require("../controllers/chatController");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/", checkAuth, createChat);
router.get("/:userId", checkAuth, findUserChats);
router.get("/find/:firstId/:secondId", checkAuth, findChat);
router.post("/:chatId/pinMessage", checkAuth, pinMessage);
router.post("/:chatId/unpinMessage", checkAuth, unpinMessage);
router.get("/:chatId/pinnedMessages", checkAuth, getPinnedMessages);

module.exports = router;
