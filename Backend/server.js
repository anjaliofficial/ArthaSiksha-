const express = require('express');
const bcrypt = require('bcrypt');
const pg = require('pg');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pool = require('./db');

dotenv.config();

const app = express();

app.use(express.json());

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
