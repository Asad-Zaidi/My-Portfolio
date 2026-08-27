// Must run after `protect` (which sets req.admin). Kept as its own
// middleware so routes can be layered/read as `protect, adminOnly`,
// and so role checks beyond "admin" can be added later without
// touching authMiddleware.
function adminOnly(req, res, next) {
  if (req.admin && req.admin.role === "admin") return next();
  return res.status(403).json({ message: "Admin access required." });
}

module.exports = { adminOnly };
