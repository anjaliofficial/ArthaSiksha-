const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const articleRoutes = require('./routes/articleRoutes');
const quizRoutes = require('./routes/quizRoutes');

dotenv.config();
const app = express();

// ---------------- MIDDLEWARES ----------------
app.use(express.json());           // Parse JSON bodies
app.use(cookieParser());           // Parse cookies

// ---------------- CORS ----------------
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

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
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
