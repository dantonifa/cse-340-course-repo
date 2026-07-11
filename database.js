import pg from "pg";
const { Pool } = pg;
import "dotenv/config";

let pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
}

export default pool;
