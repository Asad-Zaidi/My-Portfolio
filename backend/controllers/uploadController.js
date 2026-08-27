const asyncHandler = require("../utils/asyncHandler");

// POST /api/upload — admin only. Multer + multer-storage-cloudinary
// (configured in routes/uploadRoutes.js) has already streamed the file to
// Cloudinary by the time this handler runs; req.file carries the result.
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file received." });
  }
  res.status(201).json({
    url: req.file.path,
    publicId: req.file.filename,
  });
});

module.exports = { uploadFile };
