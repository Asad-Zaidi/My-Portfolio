const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
console.log("DNS Servers:", dns.getServers());


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

const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://asadzaidi.vercel.app",
    ...(process.env.CLIENT_URL
        ? process.env.CLIENT_URL.split(",").map((url) => url.trim().replace(/\/+$/, ""))
        : []),
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, curl, Postman)
            if (!origin) return callback(null, true);

            const normalizedOrigin = origin.replace(/\/+$/, "");
            if (
                allowedOrigins.includes(normalizedOrigin) ||
                normalizedOrigin.endsWith(".vercel.app")
            ) {
                return callback(null, true);
            }

            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Log completed requests in the compact, colorized format shown in the terminal.
// Example: GET /api/products 200 427.394 ms - 112486
app.use(morgan("dev"));

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
