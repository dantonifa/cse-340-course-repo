import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  showDashboard,
  requireLogin,
  requireRole,
  showUsersPage,
  handleJoinProject,
  handleLeaveProject,
} from "./controllers/users.js";

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

// Route to display a specific organization's details page
router.get("/organization/:id", showOrganizationDetailsPage);

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

/*Create a GET route for /register to call the showUserRegistrationForm 
controller function. Create a POST route for /register to call the 
processUserRegistrationForm controller function.*/

router.get("/register", showUserRegistrationForm);
router.post("/register", processUserRegistrationForm);

// Create a GET route for /login to call the showLoginForm controller function.
router.get("/login", showLoginForm);

// Create a GET route for /logout to call the processLogout controller function.
router.get("/logout", processLogout);

// Post routes
router.post("/login", processLoginForm);

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

// Add a GET route for /login that calls the showLoginForm controller function.
router.get("/login", showLoginForm);
router.post("/login", processLoginForm);

/*Add a new route for /dashboard that uses the requireLogin middleware
 before calling the showDashboard controller function.*/

router.get("/dashboard", requireLogin, showDashboard);

// Route for registered users overview page
router.get("/users", requireLogin, requireRole("admin"), showUsersPage);

// Routes for volunteering (Protected by requireLogin middleware)
router.get("/projects/:id/join", requireLogin, handleJoinProject);
router.get("/projects/:id/leave", requireLogin, handleLeaveProject);

export default router;
