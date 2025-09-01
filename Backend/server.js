const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const moduleRoutes = require('./routes/moduleRoutes');

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);

app.listen(3000, ()=> console.log('🚀 Server running on port 3000'));
