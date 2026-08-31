const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/auth/login
// Only entry point into the admin area — accounts are created via the
// seed script, not through a public register endpoint.
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+password");
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = generateToken({ id: admin._id });
  res.json({
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({
    id: req.admin._id,
    name: req.admin.name,
    email: req.admin.email,
    role: req.admin.role,
  });
});

// PUT /api/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required." });
  }

  const admin = await Admin.findById(req.admin._id).select("+password");
  if (!admin) {
    return res.status(404).json({ message: "Admin account not found." });
  }

  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect." });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ message: "New password cannot be the same as your current password." });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long." });
  }
  if (!/[A-Z]/.test(newPassword)) {
    return res.status(400).json({ message: "Password must contain at least one uppercase letter." });
  }
  if (!/[a-z]/.test(newPassword)) {
    return res.status(400).json({ message: "Password must contain at least one lowercase letter." });
  }
  if (!/[0-9]/.test(newPassword)) {
    return res.status(400).json({ message: "Password must contain at least one number." });
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(newPassword)) {
    return res.status(400).json({ message: "Password must contain at least one special character." });
  }

  admin.password = newPassword;
  await admin.save();

  res.json({ message: "Password changed successfully." });
});

module.exports = { login, getMe, changePassword };
