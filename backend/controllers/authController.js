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

module.exports = { login, getMe };
