const Message = require("../models/Message");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/contact — public, called by the Contact section's form.
const sendMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const doc = await Message.create({ name, email, subject, message });
  res.status(201).json({ message: "Message sent successfully.", id: doc._id });
});

// GET /api/contact — admin only, to read submissions.
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
});

// PATCH /api/contact/:id/read — admin only.
const markRead = asyncHandler(async (req, res) => {
  const doc = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!doc) return res.status(404).json({ message: "Message not found." });
  res.json(doc);
});

// DELETE /api/contact/:id — admin only.
const deleteMessage = asyncHandler(async (req, res) => {
  const doc = await Message.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ message: "Message not found." });
  res.json({ message: "Message deleted." });
});

module.exports = { sendMessage, getMessages, markRead, deleteMessage };
