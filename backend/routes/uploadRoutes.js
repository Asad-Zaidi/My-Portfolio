const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../services/cloudinary");
const { uploadFile } = require("../controllers/uploadController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "portfolio",
    resource_type: "auto", // images, and raw files like the résumé PDF
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const router = express.Router();

router.post("/", protect, adminOnly, upload.single("file"), uploadFile);

module.exports = router;
