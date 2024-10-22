const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {
  registerUser,
  loginUser,
  findUser,
  getUsers,
  updateAvatar,
  updateUser,
  blockUser,
  unblockUser,
} = require("../controllers/userController");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);
router.patch("/avatar", checkAuth, upload.single("avatar"), updateAvatar);
router.patch("/", checkAuth, updateUser);
router.patch("/block", checkAuth, blockUser);
router.patch("/unblock", checkAuth, unblockUser);

module.exports = router;
