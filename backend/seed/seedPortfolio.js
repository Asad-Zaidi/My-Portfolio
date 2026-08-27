// Populates MongoDB with the initial content that used to live in
// frontend/src/data/data.json, and creates the admin login used to edit
// it later. Safe to re-run: it upserts rather than duplicating.
//
// Usage:  npm run seed   (from the backend/ folder)

const path = require("path");
const fs = require("fs");
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Portfolio = require("../models/Portfolio");
const Admin = require("../models/Admin");

const DATA_JSON_PATH = path.join(__dirname, "..", "..", "frontend", "src", "data", "data.json");

async function seedPortfolio() {
  if (!fs.existsSync(DATA_JSON_PATH)) {
    throw new Error(`Could not find data.json at ${DATA_JSON_PATH}`);
  }
  const raw = fs.readFileSync(DATA_JSON_PATH, "utf-8");
  const data = JSON.parse(raw);

  const doc = await Portfolio.findOneAndUpdate(
    { slug: "main" },
    { $set: { ...data, slug: "main" } },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  console.log(`Portfolio document seeded (id: ${doc._id}).`);
}

async function seedAdmin() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — skipping admin creation.");
    return;
  }

  const existing = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log(`Admin account already exists for ${ADMIN_EMAIL} — leaving it untouched.`);
    return;
  }

  await Admin.create({
    name: ADMIN_NAME || "Admin",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  console.log(`Admin account created for ${ADMIN_EMAIL}.`);
}

async function run() {
  try {
    await connectDB();
    await seedPortfolio();
    await seedAdmin();
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit(process.exitCode || 0);
  }
}

run();
