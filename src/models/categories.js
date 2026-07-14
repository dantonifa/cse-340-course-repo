import pool from "./db.js";

// Function to get all categories from the database ordered alphabetically by name
export async function getAllCategories() {
  try {
    const sql = "SELECT * FROM public.categories ORDER BY category_name ASC";
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error("Error fetching categories from database:", error);
    throw error;
  }
}
