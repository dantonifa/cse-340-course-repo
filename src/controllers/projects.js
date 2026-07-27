/*Create a projectValidation array to define the validation rules for projects as follows: (remember that AI can be very helpful in generating validation code, but be sure to review and test it thoroughly)
title: trim, ensure not empty, length between 3 and 200.
description: trim, ensure not empty, length less than 1000.
location: trim, ensure not empty, length less than 200.
date: ensure not empty, valid date format.
organizationId: ensure not empty, valid integer.*/

import { body, validationResult } from "express-validator";

export const projectValidation = [
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

// Define any controller functions
const showProjectsPage = async (req, res) => {
  // Pass 5 as the number of projects to retrieve
  const projects = await getUpcomingProjects(5);
  const title = "Service Projects";

  res.render("projects", { title, projects });
};

// Export any controller functions
export { showProjectsPage, showNewProjectForm, processNewProjectForm };
