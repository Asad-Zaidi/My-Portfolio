require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const registerRoutes = require("./index");

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000"
    })
);

app.use(express.json());

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// API information
app.get("/", (req, res) => {
    res.json({
        message: "Backend is running",
        status: "success",
        version: "1.0.0",
        docs: "/docs",
        health: "/api/health",
    });
});

// Interactive API documentation
app.get("/docs.json", (req, res) => {
    res.json(swaggerSpec);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

// Register API routes
registerRoutes(app);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });
    })
    .catch((err) => {
        console.error(
            "Failed to connect to MongoDB:",
            err.message
        );

        process.exit(1);
    });

module.exports = app;