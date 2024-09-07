const express = require("express");
const {
  createMessage,
  getMessages,
  reactToMessage,
  replyToMessage,
  deleteMessage,
} = require("../controllers/messageController");
const checkAuth = require("../middleware/check-auth");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/", checkAuth, upload.single("file"), createMessage);
router.get("/:chatId", getMessages);
router.patch("/react/:messageId", reactToMessage);
router.post("/reply/:messageId", replyToMessage);
router.delete("/:messageId", deleteMessage);

module.exports = router;
