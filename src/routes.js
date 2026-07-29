//Import showNewOrganizationForm controller function
import express from "express";
import { showHomePage } from "./controllers/index.js";
import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm,
} from "./controllers/organizations.js";

import {
  showProjectsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
} from "./controllers/projects.js";

import {
  showCategoriesPage,
  showNewCategoryForm,
  processNewCategoryForm,
  categoryValidation,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
} from "./controllers/categories.js";

import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);

// Route for new organization page
router.get("/new-organization", showNewOrganizationForm);

// Route for edit organization page
router.get("/edit-organization/:id", showEditOrganizationForm);

// Route to display the new category form
router.get("/new-category", showNewCategoryForm);

// Route to display the edit category form with existing data
router.get("/edit-category/:id", showEditCategoryForm);

// Post route to process the new category form submission
router.post("/new-category", categoryValidation, processNewCategoryForm);

// Post route to handle updating the category in the database
router.post("/edit-category/:id", categoryValidation, processEditCategoryForm);

// Post routes
router.post(
  "/new-organization",
  organizationValidation,
  processNewOrganizationForm,
);
// Add a GET route for /project/:projectId/assign-categories that calls
// the showAssignCategoriesForm controller function.

router.get("/project/:projectId/assign-categories", showAssignCategoriesForm);

/*Add a POST route for /project/:projectId/assign-categories that 
calls the processAssignCategoriesForm controller function.*/

router.post(
  "/project/:projectId/assign-categories",
  processAssignCategoriesForm,
);

router.post("/edit-organization/:id", processEditOrganizationForm);

router.get("/organizations/:id", showOrganizationDetailsPage);

router.get("/projects", showProjectsPage);
router.get("/new-project", showNewProjectForm);
router.post("/new-project", projectValidation, processNewProjectForm);
router.get("/categories", showCategoriesPage);

/*Add a GET route for /project/:projectId/assign-categories that calls the 
showAssignCategoriesForm controller function.*/
router.get("/project/:projectId/assign-categories", showAssignCategoriesForm);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
