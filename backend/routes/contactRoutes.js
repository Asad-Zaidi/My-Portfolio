const express = require("express");
const { sendMessage, getMessages, markRead, deleteMessage } = require("../controllers/contactController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/", sendMessage);
router.get("/", protect, adminOnly, getMessages);
router.patch("/:id/read", protect, adminOnly, markRead);
router.delete("/:id", protect, adminOnly, deleteMessage);

module.exports = router;
