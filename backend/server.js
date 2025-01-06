require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path"); // Import path module
const adminRoutes = require("./routes/adminRoutes");
const mandirRoutes = require("./routes/mandirRoutes"); // Add Mandir routes
const eventRoutes = require("./routes/eventRoutes");
const bookRoutes = require("./routes/bookRoutes");
const suvicharRoutes = require("./routes/suvicharRoutes");

const app = express();

// Middleware for CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Only allow requests from your React frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    credentials: true, // Allow credentials (cookies, headers, etc.)
  })
);

app.use(bodyParser.json({ limit: "100mb" })); // Increase the limit for base64 data
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // URL encoding with larger data
app.use(express.json()); // Middleware for parsing JSON

// Static file serving for images
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images from 'uploads' folder

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/mandir", mandirRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/suvichar", suvicharRoutes); // Add suvichar routes

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
