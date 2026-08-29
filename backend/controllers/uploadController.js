const asyncHandler = require("../utils/asyncHandler");

// POST /api/upload — admin only. Multer + multer-storage-cloudinary
// (configured in routes/uploadRoutes.js) has already streamed the file to
// Cloudinary by the time this handler runs; req.file carries the result.
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    console.error(`[Upload] ❌ [${new Date().toLocaleTimeString()}] Upload failed: No file received.`);
    return res.status(400).json({ message: "No file received." });
  }

  const sizeKb = (req.file.size ? (req.file.size / 1024).toFixed(2) : "Unknown") + " KB";
  console.log(`[Upload] ✅ [${new Date().toLocaleTimeString()}] Upload successful!`);
  console.log(`  ├── Original Name: ${req.file.originalname || "N/A"}`);
  console.log(`  ├── Size: ${sizeKb}`);
  console.log(`  ├── Public ID: ${req.file.filename}`);
  console.log(`  └── URL: ${req.file.path}\n`);

  res.status(201).json({
    url: req.file.path,
    publicId: req.file.filename,
  });
});

module.exports = { uploadFile };
