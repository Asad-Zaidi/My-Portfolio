const Portfolio = require("../models/Portfolio");
const asyncHandler = require("../utils/asyncHandler");

// Top-level keys that are nested objects vs. arrays — needed because they
// are updated differently: objects are shallow-merged field by field,
// arrays are replaced wholesale (an admin panel edits/saves a whole list
// at once, so partial array patches would be ambiguous).
const OBJECT_KEYS = ["meta", "personal", "hero", "about", "personalInfoCard", "skills", "contact", "resume"];
const ARRAY_KEYS = ["stats", "education", "experience", "certifications", "blogs", "badges", "hobbies", "languages", "socials", "nav"];

async function getOrCreatePortfolio() {
  let doc = await Portfolio.findOne({ slug: "main" });
  if (!doc) doc = await Portfolio.create({ slug: "main" });
  return doc;
}

// GET /api/portfolio — public. Everything the site renders comes from here.
const getPortfolio = asyncHandler(async (req, res) => {
  const doc = await getOrCreatePortfolio();
  res.json(doc.toJSON());
});

// PATCH /api/portfolio — admin only. Body may contain any subset of the
// top-level sections; object sections are merged field-by-field, array
// sections are replaced in full.
const updatePortfolio = asyncHandler(async (req, res) => {
  const doc = await getOrCreatePortfolio();
  const body = req.body || {};

  for (const key of OBJECT_KEYS) {
    if (body[key] && typeof body[key] === "object" && !Array.isArray(body[key])) {
      doc[key] = { ...doc[key]?.toObject?.(), ...body[key] };
    }
  }

  for (const key of ARRAY_KEYS) {
    if (Array.isArray(body[key])) {
      doc[key] = body[key];
    }
  }

  await doc.save();
  res.json(doc.toJSON());
});

module.exports = { getPortfolio, updatePortfolio };
