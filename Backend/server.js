const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const articleRoutes = require('./routes/articleRoutes');
const quizRoutes = require('./routes/quizRoutes');


dotenv.config();
const app = express();

// ---------------- MIDDLEWARES ----------------
app.use(express.json({ limit: "10mb" }));      // for large JSON
app.use(express.urlencoded({ limit: "10mb", extended: true })); 
app.use(cookieParser());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------------- CORS ----------------
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// ---------------- ROUTES ----------------
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/quizzes', quizRoutes);

// ---------------- TEST ROUTE ----------------
app.get('/', (req, res) => res.send('API is running...'));

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
