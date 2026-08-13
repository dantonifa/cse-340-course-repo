import pool from "./db.js";

/* Create a function assignCategoryToProject that takes two parameters: projectId and categoryId.
This function should execute a SQL query to insert a new record into the many-to-many relationship table
that links projects and categories. */
const assignCategoryToProject = async (projectId, categoryId) => {
  try {
    const sql =
      "INSERT INTO public.project_categories (project_id, category_id) VALUES ($1, $2)";
    const result = await pool.query(sql, [projectId, categoryId]);
    return result.rowCount;
  } catch (error) {
    console.error("Error assigning category to project:", error);
    throw error;
  }
};

/* Create a function updateCategoryAssignments that takes two parameters: projectId and categoryIds
(an array of category IDs that should be assigned to the project). This function should first
execute a SQL query to delete all existing category assignments for the specified project
from the many-to-many relationship table. Then, for each categoryId in the categoryIds array,
call the assignCategoryToProject function to create the new assignments. */
const updateCategoryAssignments = async (projectId, categoryIds) => {
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
};
// Function to get all categories
const getAllCategories = async () => {
  try {
    const sql = "SELECT * FROM public.categories ORDER BY category_name ASC";
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw error;
  }
};

// Fetch category meta details by its unique ID
async function getCategoryById(category_id) {
  try {
    const sql = "SELECT * FROM public.categories WHERE category_id = $1";
    const result = await pool.query(sql, [category_id]);
    return result.rows; // Returns the rows array to the controller
  } catch (error) {
    throw error;
  }
}

// Function to update an existing category name
const updateCategory = async (id, name) => {
  try {
    const sql =
      "UPDATE public.categories SET category_name = $1 WHERE category_id = $2";
    await pool.query(sql, [name, id]);
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Function to get categories assigned to a specific project
const getCategoriesByServiceProjectId = async (projectId) => {
  try {
    const sql =
      "SELECT category_id FROM public.project_categories WHERE project_id = $1";
    const result = await pool.query(sql, [projectId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching categories by project ID:", error);
    throw error;
  }
};

/* Create a function to insert a brand new category into the database */
const createCategory = async (category_name) => {
  try {
    const sql =
      "INSERT INTO public.categories (category_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [category_name]);
    return result.rows;
  } catch (error) {
    console.error("Error creating category in model:", error);
    throw error;
  }
};

// Fetch all projects matching a specific category ID
async function getProjectsByCategoryId(category_id) {
  try {
    const sql = `
            SELECT p.* 
            FROM public.service_projects p 
            JOIN public.project_categories pc ON p.project_id = pc.project_id 
            WHERE pc.category_id = $1
        `;
    const result = await pool.query(sql, [category_id]);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

export {
  assignCategoryToProject,
  updateCategoryAssignments,
  getAllCategories,
  getCategoryById,
  updateCategory,
  getCategoriesByServiceProjectId,
  createCategory,
  getProjectsByCategoryId,
};
