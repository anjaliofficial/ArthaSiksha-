const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const articleRoutes = require('./routes/articleRoutes');
const quizRoutes = require('./routes/quizRoutes');
const profileRoutes = require('./routes/profileRoutes');


dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use('/api/modules', moduleRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/quizzes', quizRoutes);

// CORS
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// ❌ Remove this or change '*' to '/api/*'
// app.options('*', cors({...}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
