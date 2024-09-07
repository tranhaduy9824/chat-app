const express = require("express");
const {
  createMessage,
  getMessages,
  reactToMessage,
  deleteMessage,
} = require("../controllers/messageController");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/", upload.single("media"), createMessage);
router.get("/:chatId", getMessages);
router.patch("/react/:messageId", reactToMessage);
router.delete("/:messageId", deleteMessage);

module.exports = router;
