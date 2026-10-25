const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const medicineRoutes = require("./routes/medicineRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Built frontend (client/dist) is served by this same server in production.
const CLIENT_DIST = path.resolve(__dirname, "../../client/dist");
const CLIENT_INDEX = path.join(CLIENT_DIST, "index.html");
const hasClientBuild = fs.existsSync(CLIENT_INDEX);

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MedKhoj AI backend is running",
    frontend: hasClientBuild ? "served" : "not built"
  });
});

app.use("/api/medicines", medicineRoutes);
app.use("/api/ai", rateLimit({
  windowMs: 60 * 1000,
  limit: 12,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many AI requests. Please wait a minute and try again."
  }
}), aiRoutes);

// Unknown /api routes always answer with JSON.
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

if (hasClientBuild) {
  app.use(express.static(CLIENT_DIST));

  // SPA fallback: every other GET returns index.html so React Router can handle it.
  app.get("/{*splat}", (req, res) => {
    res.sendFile(CLIENT_INDEX);
  });
} else {
  app.get("/", (req, res) => {
    res.send(`
      <h1>MedKhoj AI</h1>
      <p>Backend is running, but the frontend has not been built yet.</p>
      <p>Run <code>npm run build</code> in the project root, then restart the server.</p>
      <p><a href="/api/health">Health Check</a> | <a href="/api/medicines">Medicine Catalogue API</a></p>
    `);
  });
}

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

module.exports = app;
