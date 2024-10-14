const express = require("express");
const {
  createChat,
  findUserChats,
  findChat,
} = require("../controllers/chatController");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/", checkAuth, createChat);
router.get("/:userId", checkAuth, findUserChats);
router.get("/find/:firstId/:secondId", checkAuth, findChat);

module.exports = router;
