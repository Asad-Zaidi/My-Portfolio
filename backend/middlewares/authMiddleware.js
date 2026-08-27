const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const Admin = require("../models/Admin");

// Verifies the Bearer token and attaches the admin document to req.admin.
// Used to gate every route that writes to the portfolio (updates, uploads).
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: "Not authorized, admin no longer exists." });
    }
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token." });
  }
});

module.exports = { protect };
