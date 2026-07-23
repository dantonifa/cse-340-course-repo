//Import showNewOrganizationForm controller function
import express from "express";

import { showHomePage } from "./controllers/index.js";
import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
} from "./controllers/organizations.js";

import { showProjectsPage } from "./controllers/projects.js";
import { showCategoriesPage } from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/organizations/:id", showOrganizationDetailsPage);

router.get("/projects", showProjectsPage);
router.get("/categories", showCategoriesPage);

// error-handling routes
router.get("/test-error", testErrorPage);

// Route for new organization page
router.get("/new-organization", showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', processNewOrganizationForm);



export default router;
