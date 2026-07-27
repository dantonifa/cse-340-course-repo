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
  showAssignCategoriesForm,
  processAssignCategoriesForm,
} from "./controllers/projects.js";
import { showCategoriesPage } from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);

// Route for new organization page
router.get("/new-organization", showNewOrganizationForm);

// Route for edit organization page
router.get("/edit-organization/:id", showEditOrganizationForm);

// Post routes
router.post(
  "/new-organization",
  organizationValidation,
  processNewOrganizationForm,
);

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
router.get("/assign-categories/:projectId", showAssignCategoriesForm);
router.post("/assign-categories/:projectId", processAssignCategoriesForm);
/*Add a GET route for /project/:projectId/assign-categories that calls the 
showAssignCategoriesForm controller function.*/
router.get("/project/:projectId/assign-categories", showAssignCategoriesForm);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
