require("dotenv").config();
const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Only allow requests from your React frontend
    methods: ["GET", "POST"], // Specify allowed methods
    credentials: true, // Allow credentials (cookies, headers, etc.)
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
