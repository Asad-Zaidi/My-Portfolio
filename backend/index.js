const authRoutes = require("./routes/authRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const contactRoutes = require("./routes/contactRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const registerRoutes = (app) => {

    app.use("/api/auth", authRoutes);

    app.use("/api/portfolio", portfolioRoutes);

    app.use("/api/contact", contactRoutes);

    app.use("/api/upload", uploadRoutes);

};

module.exports = registerRoutes;