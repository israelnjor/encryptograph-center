const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const Notification = require("./models/Notification");

const app = express();

// ----------------- MIDDLEWARE -----------------
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// ----------------- DATABASE CONNECTION -----------------
mongoose.connect("mongodb://127.0.0.1:27017/notifications", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ----------------- API ROUTES -----------------

// GET all notifications
app.get("/api/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new notification
app.post("/api/notifications", async (req, res) => {
  try {
    const { message, type } = req.body;
    if (!message || !type) {
      return res.status(400).json({ error: "Message and type are required" });
    }

    const notification = new Notification({ 
      message, 
      type: type.toLowerCase() 
    });
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE notification by ID
app.delete("/api/notifications/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- FALLBACK (Single Page Apps) -----------------
// If no API route matches, serve index.html (useful for frontend routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ----------------- START SERVER -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
