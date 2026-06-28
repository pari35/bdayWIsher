import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Database connected successfully!");
    console.log("Server Time:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();

export default pool;