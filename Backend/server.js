const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

// ---------------- LOAD ENV ----------------
dotenv.config();

// ---------------- INIT APP ----------------
const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// ---------------- MIDDLEWARES ----------------
app.use(express.json({ limit: "10mb" })); // for large JSON
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// ---------------- STATIC FILES ----------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------- CORS ----------------
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Handle preflight requests manually
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", CLIENT_URL);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});

// ---------------- ROUTES ----------------
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const articleRoutes = require("./routes/articleRoutes");
const quizRoutes = require("./routes/quizRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/notification", notificationRoutes);

// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => res.send("✅ API is running..."));

// ---------------- SOCKET.IO ----------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware to attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ---------------- START SERVER ----------------
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
