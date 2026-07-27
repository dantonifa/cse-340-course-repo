import pool from "./db.js";

/*Create a function assignCategoryToProject that takes two parameters: projectId and categoryId.
This function should execute a SQL query to insert a new record into the many-to-many relationship table 
that links projects and categories.*/
export async function assignCategoryToProject(projectId, categoryId) {
  try {
    const sql =
      "INSERT INTO public.project_categories (project_id, category_id) VALUES ($1, $2)";
    const result = await pool.query(sql, [projectId, categoryId]);
    return result.rowCount;
  } catch (error) {
    console.error("Error assigning category to project:", error);
    throw error;
  }
}

/*Create a function updateCategoryAssignments that takes two parameters: projectId and categoryIds
(an array of category IDs that should be assigned to the project). This function should first 
execute a SQL query to delete all existing category assignments for the specified project 
from the many-to-many relationship table. Then, for each categoryId in the categoryIds array,
call the assignCategoryToProject function to create the new assignments.*/
export async function updateCategoryAssignments(projectId, categoryIds) {
  try {
    const deleteSql =
      "DELETE FROM public.project_categories WHERE project_id = $1";
    await pool.query(deleteSql, [projectId]);
    for (const categoryId of categoryIds) {
      await assignCategoryToProject(projectId, categoryId);
    }
  } catch (error) {
    console.error("Error updating category assignments:", error);
    throw error;
  }
}

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
