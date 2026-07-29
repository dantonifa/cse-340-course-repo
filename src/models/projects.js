import db from "./db.js";

/* *****************************
 * Get all projects (Temporary fallback)
 * *************************** */
const getAllProjects = async () => {
  return [];
};

/* *****************************
 * Get projects by organization ID
 * *************************** */
const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT project_id, organization_id, title 
    FROM public.service_projects 
    WHERE organization_id = $1
  `;
  const result = await db.query(query, [organizationId]);
  return result.rows;
};

/* *****************************
 * Get upcoming service projects (Dynamically limited)
 * *************************** */
const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.date,
      p.location,
      p.organization_id,
      o.name AS organization_name,
      COALESCE(ARRAY_AGG(c.category_name) FILTER (WHERE c.category_name IS NOT NULL), '{}') AS categories
    FROM public.service_projects p
    INNER JOIN public.organizations o ON p.organization_id = o.organization_id
    LEFT JOIN public.project_categories pc ON p.project_id = pc.project_id
    LEFT JOIN public.categories c ON pc.category_id = c.category_id
    WHERE p.date >= CURRENT_DATE
    GROUP BY p.project_id, o.name
    ORDER BY p.date ASC
    LIMIT $1;
  `;

  const result = await db.query(query, [number_of_projects]);
  return result.rows;
};

const createProject = async (
  title,
  description,
  location,
  date,
  organizationId,
) => {
  const query = `
      INSERT INTO public.service_projects (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create project");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new project with ID:", result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

// Create and export getProjectDetails function that takes a projectId as a parameter
// and retrieves the details of the specified project from the database.
// The function should return an object containing the project details,
// including the project ID, title, description, location, date,
// organization ID, and organization name.

export async function getProjectDetails(projectId) {
  try {
    const sql = `
      SELECT 
        p.project_id, 
        p.title, 
        p.description, 
        p.location, 
        p.date, 
        p.organization_id, 
        o.name AS organization_name
      FROM public.service_projects p
      INNER JOIN public.organizations o 
        ON p.organization_id = o.organization_id
      WHERE p.project_id = $1
    `;
    const result = await db.query(sql, [projectId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching project details by ID:", error);
    throw error;
  }
}

// Export all model functions
export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  createProject,
};
