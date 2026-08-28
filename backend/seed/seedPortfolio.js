// Creates the admin login used to edit the portfolio through the API.
//
// Usage:  npm run seed   (from the backend/ folder)

require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");

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
