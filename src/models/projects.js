import db from "./db.js";

// Database query function for projects
const getAllProjects = async () => {
  // This is a temporary placeholder returning an empty array until connected to your DB
  return [];
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM projects
        WHERE organization_id = $1
        ORDER BY date;
      `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

// ... this is the end of your getProjectsByOrganizationId function (line 27)

/* *****************************
 * Get upcoming service projects
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
      o.organization_name
    FROM public.projects p
    INNER JOIN public.organizations o 
      ON p.organization_id = o.organization_id
    WHERE p.date >= CURRENT_DATE
    ORDER BY p.date ASC
    LIMIT $1;
  `;

  const result = await db.query(query, [number_of_projects]);
  return result.rows;
};

// Export the model functions
export { getUpcomingProjects, getProjectsByOrganizationId, getAllProjects };
