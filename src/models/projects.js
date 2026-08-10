import db from "./db.js";

/* *****************************
 * Get all projects (Temporary fallback)
 * *************************** */
const getAllProjects = async () => {
  try {
    const query = "SELECT * FROM public.service_projects";
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error in getAllProjects model:", error);
    throw error;
  }
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
const getUpcomingProjects = async (number_of_projects = 3) => {
  try {
    const query = "SELECT * FROM public.service_projects LIMIT $1";
    const result = await db.query(query, [number_of_projects]);
    return result.rows;
  } catch (error) {
    console.error("Error in getUpcomingProjects model:", error);
    throw error;
  }
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

async function getProjectDetails(projectId) {
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

/** 

* Add a volunteer to a project
* @param {number} userId - The user ID
* @param {number} projectId - The project ID
*/
async function addVolunteer(userId, projectId) {
  try {
    const sql = `INSERT INTO project_volunteer (user_id, project_id)  VALUES ($1, $2) RETURNING *`;
    const result = await db.query(sql, [userId, projectId]);
    return result.rows;
  } catch (error) {
    console.error("Error in addVolunteer:", error);
    throw error;
  }
}

/** 

* Remove a volunteer from a project
* @param {number} userId - The user ID
* @param {number} projectId - The project ID
*/
async function removeVolunteer(userId, projectId) {
  try {
    const sql = `DELETE FROM project_volunteer  WHERE user_id = $1 AND project_id = $2 RETURNING *`;
    const result = await db.query(sql, [userId, projectId]);
    return result.rowCount > 0; // Returns true if a row was deleted
  } catch (error) {
    console.error("Error in removeVolunteer:", error);
    throw error;
  }
}

/** 

* Get all projects a user has volunteered for
* @param {number} userId - The user ID
*/
const getProjectsByVolunteer = async (userId) => {
  try {
    const sql = `SELECT p.*  FROM public.service_projects p JOIN public.project_volunteer pv ON p.project_id = pv.project_id WHERE pv.user_id = $1`;
    const result = await db.query(sql, [userId]);
    return result.rows;
  } catch (error) {
    console.error("Error in getProjectsByVolunteer:", error);
    throw error;
  }
};

export {
  getProjectsByOrganizationId,
  getUpcomingProjects,
  createProject,
  getProjectDetails,
  addVolunteer,
  removeVolunteer,
  getProjectsByVolunteer,
};
