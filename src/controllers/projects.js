// Import any needed model functions
import { getUpcomingProjects } from "../models/projects.js";

// Define any controller functions
const showProjectsPage = async (req, res) => {
  // Pass 5 as the number of projects to retrieve
  const projects = await getUpcomingProjects(5);
  const title = "Service Projects";

  res.render("projects", { title, projects });
};

// Export any controller functions
export { showProjectsPage };
