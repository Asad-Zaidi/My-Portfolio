const express = require("express");
const { getPortfolio, updatePortfolio } = require("../controllers/portfolioController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/", getPortfolio);
router.patch("/", protect, adminOnly, updatePortfolio);

module.exports = router;
