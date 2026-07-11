import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../models/db.js"; // Imports your existing database connection pool

// Define __dirname behavior for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  try {
    // Resolve path to the setup.sql file
    const sqlPath = path.join(__dirname, "setup.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Execute the SQL script queries against the database
    await pool.query(sql);
    console.log(
      "Database successfully updated with the new organization logos!",
    );
    process.exit(0);
  } catch (err) {
    console.error("Error updating the database:", err);
    process.exit(1);
  }
}

run();
