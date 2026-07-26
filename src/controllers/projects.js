// Import any needed model functions
import { getUpcomingProjects, createProject } from "../models/projects.js";

//add an import for the getAllOrganizations function from the
// ../models/organizations.js file.

import { getAllOrganizations } from "../models/organizations.js";

// create a new function named showNewProjectForm. This function should do the following:
// Call the getAllOrganizations model function to get a list of all organizations from the database.
// ender the new-project view, passing in the page title and the list of organizations to populate the dropdown menu.

const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = "New Project";

  res.render("new-project", { title, organizations });
};

// Create another function named processNewProjectForm. This function should do the following:
// Extract the project data (organizationId, title, description, location, date) from the form submission using req.body.
// Call the createProject model function you created in the previous step, passing all of the necessary parameters.
// After the insertion is complete, set a success flash message.
// Redirect the user back to the main service project list page.

const processNewProjectForm = async (req, res) => {
  const { organizationId, title, description, location, date } = req.body;
  try {
    const newProyectId = await createProject(title, description, location, date, organizationId);
    req.flash("success", "Project creates successfully!");
    res.redirect("/projects");
  } catch (error) {
    req.flash("error", "Failed to create project.");
    res.redirect("/projects/new");
  }
}; 
}

// Define any controller functions
const showProjectsPage = async (req, res) => {
  // Pass 5 as the number of projects to retrieve
  const projects = await getUpcomingProjects(5);
  const title = "Service Projects";

  res.render("projects", { title, projects });
};

// Export any controller functions
export { showProjectsPage, showNewProjectForm, processNewProjectForm };
