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
      o.name AS organization_name
    FROM public.service_projects p
    INNER JOIN public.organizations o 
      ON p.organization_id = o.organization_id
    WHERE p.date >= CURRENT_DATE
    ORDER BY p.date ASC
    LIMIT $1;
  `;

  const result = await db.query(query, [number_of_projects]);
  return result.rows;
};

// Export all model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects };
