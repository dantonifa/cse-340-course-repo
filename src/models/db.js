import pg from "pg";
const { Pool } = pg;
import "dotenv/config";

let pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: true,
  });
}

let db = null;

if (
  process.env.NODE_ENV === "development" &&
  process.env.ENABLE_SQL_LOGGING === "true"
) {
  db = {
    query: async (text, params) => {
      try {
        const res = await pool.query(text, params);
        console.log(`executed query: ${text}`);
        return res;
      } catch (error) {
        console.error(`error in query: ${error}`);
        throw error;
      }
    },
  };
} else {
  db = pool;
}

export default db;
