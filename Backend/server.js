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

// ---------------- MULTIPLE FRONTEND ORIGINS ----------------
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim());

// ---------------- MIDDLEWARES ----------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
// Static files must be exposed before API routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------- CORS ----------------
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Log the error and deny the request
        console.error(`CORS Error: Origin ${origin} not allowed.`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ---------------- SOCKET.IO ----------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware to attach io to requests (so controllers can emit events)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ---------------- ROUTES ----------------
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const articleRoutes = require("./routes/articleRoutes");
const quizRoutes = require("./routes/quizRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/users");
const insuranceRoutes = require("./routes/insuranceRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/insurance-sections", insuranceRoutes); // 🟢 Correct Mounting


// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => res.send("✅ API is running..."));

// ---------------- ERROR HANDLING & 404 CATCH-ALL ----------------

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

// Global Error Handler
app.use((error, req, res, next) => {
    // Determine status code (default to 500 for unhandled errors)
    const status = error.status || 500;
    
    // Log error details for the server console
    console.error(`[${status}] ${req.method} ${req.originalUrl}:`, error.message);
    
    // Send standardized JSON response to the client
    res.status(status).json({
        error: error.message,
        // Only send stack trace in development
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
});


// ---------------- SOCKET CONNECTION ----------------
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`User ${userId} joined their room`);
    } else {
      console.warn("Socket join called without a valid userId");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// ---------------- START SERVER ----------------
server.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);