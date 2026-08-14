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
  handleAddVolunteer,
  handleRemoveVolunteer,
  showProjectDetailsPage,
  showEditProjectPage,
  processUpdateProject,
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
  showCategoryDetailsPage,
} from "./controllers/categories.js";

import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();
router.get(
  "/categories/new",
  requireLogin,
  requireRole("admin"),
  showNewCategoryForm,
);

router.post(
  "/categories",
  requireLogin,
  requireRole("admin"),
  categoryValidation,
  processNewCategoryForm,
);

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
// Route to display a specific category's details page
router.get("/category/:id", showCategoryDetailsPage);

// Route to display a specific organization's details page
router.get("/organization/:id", showOrganizationDetailsPage);

// Route for new organization page
router.get(
  "/new-organization",
  requireLogin,
  requireRole("admin"),
  showNewOrganizationForm,
);

// Route for edit organization page
router.get(
  "/edit-organization/:id",
  requireLogin,
  requireRole("admin"),
  showEditOrganizationForm,
);

/*Create a new route for /project/[id] that will handle requests for the service project details page
 for a single service project as specified by the [id] parameter. This route should use the new
 showProjectDetailsPage controller function you just created. */

router.get("/project/:projectId", showProjectDetailsPage);
router.get("/projects/:projectId", showProjectDetailsPage);

router.get("/projects/edit/:projectId", showEditProjectPage);
router.post("/projects/edit/:projectId", processUpdateProject);

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

// Post route to process organization edits
router.post(
  "/edit-organization/:id",
  requireLogin,
  requireRole("admin"),
  processEditOrganizationForm,
);

router.get("/organizations/:id", showOrganizationDetailsPage);
router.get("/projects", showProjectsPage);

// Route to display the new project form
router.get(
  "/new-project",
  requireLogin,
  requireRole("admin"),
  showNewProjectForm,
);

// Post route to process new project creation
router.post(
  "/new-project",
  requireLogin,
  requireRole("admin"),
  projectValidation,
  processNewProjectForm,
);

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

// 👇 THE NEW VOLUNTEER ROUTES DIRECTLY BELOW THEM 👇

router.post(
  "/projects/volunteer/add/:projectId",
  requireLogin,
  handleAddVolunteer,
);
router.post(
  "/projects/volunteer/remove/:projectId",
  requireLogin,
  handleRemoveVolunteer,
);

export default router;
