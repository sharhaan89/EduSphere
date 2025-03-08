import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.connect()
    .then(() => console.log("✅ Connected to Neon Vercel Postgres Database"))
    .catch((err) => console.error("ERROR: Database connection error:", err.message));

export default pool;