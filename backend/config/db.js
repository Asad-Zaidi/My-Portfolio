const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error("MongoDB URI not found — set MONGODB_URI in backend/.env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected successfully.");
}

// Note: the MongoDB driver (used internally by Mongoose) already retries
// connections on its own — a manual "on disconnected" reconnect loop here
// would fire on every deliberate connection.close() too (e.g. in the seed
// script), keeping the process alive when it should exit.

module.exports = connectDB;
