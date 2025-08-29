require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false
});

// optional: test connection
pool.connect()
  .then(client => {
    console.log("✅ Connected to Aiven PostgreSQL");
    client.release();
  })
  .catch(err => console.error("❌ DB connection error", err.stack));

module.exports = pool;
