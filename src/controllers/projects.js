// Import any needed model functions
import {
  getUpcomingProjects,
  createProject,
  getProjectDetails,
  addVolunteer,
  removeVolunteer,
  getProjectsByVolunteer,
  updateProjectDetails,
} from "../models/projects.js";

import {
  getAllCategories,
  getCategoriesByServiceProjectId,
} from "../models/categories.js";

//add an import for the getAllOrganizations function from the
// ../models/organizations.js file.

import { getAllOrganizations } from "../models/organizations.js";

import { updateCategoryAssignments } from "../models/categories.js";

import { body, validationResult } from "express-validator";

/*Create a constant named, NUMBER_OF_UPCOMING_PROJECTS at the top of this file, 
and set its value to 5. Then, pass that constant to the model function. */

const NUMBER_OF_UPCOMING_PROJECTS = 5;

/*Create a projectValidation array to define the validation rules for projects as follows: (remember that AI can be very helpful in generating validation code, but be sure to review and test it thoroughly)
title: trim, ensure not empty, length between 3 and 200.
description: trim, ensure not empty, length less than 1000.
location: trim, ensure not empty, length less than 200.
date: ensure not empty, valid date format.
organizationId: ensure not empty, valid integer.*/

const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ max: 200 })
    .withMessage("Location must be less than 200 characters"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date"),
  body("organizationId")
    .notEmpty()
    .withMessage("Organization is required")
    .isInt()
    .withMessage("Organization must be a valid integer"),
];

// create a new function named showNewProjectForm. This function should do the following:
// Call the getAllOrganizations model function to get a list of all organizations from the database.
// ender the new-project view, passing in the page title and the list of organizations to populate the dropdown menu.

const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = "Upcoming Service Projects";

  res.render("new-project", { title, organizations });
};

// Create another function named processNewProjectForm. This function should do the following:
// Extract the project data (organizationId, title, description, location, date) from the form submission using req.body.
// Call the createProject model function you created in the previous step, passing all of the necessary parameters.
// After the insertion is complete, set a success flash message.
// Redirect the user back to the main service project list page.

const processNewProjectForm = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Loop through validation errors and flash them
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    // Redirect back to the new project form
    return res.redirect("/new-project");
  }

  try {
    const { organizationId, title, description, location, date } = req.body;

    const newProjectId = await createProject(
      title,
      description,
      location,
      date,
      organizationId,
    );

    req.flash("success", "Project creates successfully!");
    res.redirect("/projects");
  } catch (error) {
    req.flash("error", "Failed to create project.");
    res.redirect("/projects/new");
  }
};

/*Create a new controller function named showProjectDetailsPage that 
calls the new getProjectDetails model function you just created.
This function should extract the service project ID from the URL parameters.
It should use the getProjectDetails model function you created to retrieve the 
service project with that ID from the database. It should then render a new view
for the service project details page (project.ejs), passing in the service project data. */

const showProjectDetailsPage = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await getProjectDetails(projectId);

    // 1. Check if the user is securely authenticated
    const userId = req.session?.user?.user_id;
    let isVolunteering = false;

    // 2. If authenticated, fetch their volunteered projects to determine status
    if (userId) {
      const volunteeredProjects = await getProjectsByVolunteer(userId);

      // 3. Verify if this current project ID matches any they signed up for
      isVolunteering = volunteeredProjects.some(
        (p) => p.project_id == projectId,
      );
    }

    // 4. Safely render the view template passing all required local variables
    res.render("project", {
      title: project.title,
      project,
      isVolunteering,
    });
  } catch (error) {
    req.flash("error", "Failed to load project details.");
    res.redirect("/projects");
  }
};

/* ******************************************
 *  Build projects page view (Step 3 & 5)
 * ****************************************** */
const showProjectsPage = async (req, res, next) => {
  try {
    const title = "Projects";

    // 1. Fetch all upcoming projects (Requirement 2)
    const projects = await getUpcomingProjects(5);

    // 2. Initialize an empty array by default for guest visitors
    let volunteeredProjectIds = [];

    // 3. Requirement 3: Securely check if the user is authenticated
    if (req.session && req.session.user) {
      const userId = req.session.user.user_id;

      // Fetch all projects assigned to this specific volunteer (Requirement 5)
      const volunteeredProjects = await getProjectsByVolunteer(userId);

      // Extract only the IDs safely to use as a lookup array in the view template
      volunteeredProjectIds = (volunteeredProjects || []).map(
        (p) => p.project_id,
      );
    }

    // 4. Render the template view passing all necessary local variables
    res.render("projects", {
      title,
      projects,
      volunteeredProjectIds,
    });
  } catch (error) {
    console.error("Error in showProjectsPage controller:", error);
    req.flash("error", "An error occurred while loading projects.");
    res.redirect("/");
  }
};

//provide an export named 'processAssignCategoriesForm'.

const processAssignCategoriesForm = async (req, res) => {
  const { projectId } = req.params;
  const { categoryIds } = req.body; // Assuming categoryIds is an array of selected category IDs

  try {
    await updateCategoryAssignments(projectId, categoryIds);
    req.flash("success", "Categories updated successfully!");
    res.redirect("/projects");
  } catch (error) {
    req.flash("error", "Failed to update categories.");
    res.redirect(`/assign-categories/${projectId}`);
  }
};

//Create a new function named showAssignCategoriesForm that takes req and res as parameters.
// This function should do the following:
// Extract the projectId from req.params.
// Call the getProjectDetails model function to retrieve the details of the specified project.
// Call the getAllCategories model function to retrieve a list of all categories from the database.
// Call the getCategoriesByServiceProjectId model function to retrieve the categories currently
// assigned to the specified project.
// Render the assign-categories view, passing in the project details, all categories,
// and the assigned categories.
const showAssignCategoriesForm = async (req, res) => {
  const { projectId } = req.params;

  const project = await getProjectDetails(projectId);
  const allCategories = await getAllCategories();
  const assignedCategoriesRows =
    await getCategoriesByServiceProjectId(projectId);
  const assignedCategoryIds = assignedCategoriesRows.map(
    (row) => row.category_id,
  );

  res.render("assign-categories", {
    title: "Assign Categories",
    projectId: project.project_id,
    projectTitle: project.title,
    categories: allCategories,
    assignedCategoryIds, // This matches line 12 in your EJS template perfectly
  });
};

// Import your project model functions at the top of the file if not already present
// const projectModel = require("../models/projects");

/** 

* Render project details and check volunteer status
*/
// Handle adding a volunteer to a project
const handleAddVolunteer = async (req, res, next) => {
  try {
    // Read parameter directly from the route path structure
    const projectId = req.params.projectId;
    const userId = req.session?.user?.user_id || res.locals?.user?.user_id;

    await addVolunteer(userId, projectId);

    // Redirect back to the clean projects directory list view
    res.redirect("/projects/" + projectId);
  } catch (error) {
    console.error("Error in handleAddVolunteer controller:", error);
    next(error);
  }
};

// Handle removing a volunteer from a project
const handleRemoveVolunteer = async (req, res, next) => {
  try {
    // Read parameter directly from the route path structure
    const projectId = req.params.projectId;
    const userId = req.session?.user?.user_id || res.locals?.user?.user_id;
    await removeVolunteer(userId, projectId);

    // Redirect back to the clean projects directory list view
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error in handleRemoveVolunteer controller:", error);
    next(error);
  }
};

// Render the edit project form pre-populated with data
const showEditProjectPage = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;

    // Fetch project details and full organization list
    const projectData = await getProjectDetails(projectId);
    const organizationList = await getAllOrganizations();

    res.render("edit-project", {
      title: "Edit " + projectData.title,
      project: projectData,
      organizations: organizationList,
    });
  } catch (error) {
    next(error);
  }
};

// Process the project update in the database
const processUpdateProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const { title, description, location, date, organization_id } = req.body;

    // Execute update query through the model function
    await updateProjectDetails(
      projectId,
      title,
      description,
      location,
      date,
      organization_id,
    );

    req.flash("success", "Project updated successfully.");
    res.redirect("/projects");
  } catch (error) {
    next(error);
  }
};

export {
  handleAddVolunteer,
  handleRemoveVolunteer,
  showProjectsPage,
  showNewProjectForm,
  processNewProjectForm,
  showProjectDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  getUpcomingProjects,
  createProject,
  addVolunteer,
  removeVolunteer,
  getProjectsByVolunteer,
  showEditProjectPage,
  processUpdateProject,
  projectValidation,
};
