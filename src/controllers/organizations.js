// Import any needed model functions
import {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
  updateOrganization,
} from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";

//Import the validation functions from express-validator.
import { body, validationResult } from "express-validator";
// Define any controller functions
const showOrganizationDetailsPage = async (req, res) => {
  const organizationId = req.params.id;
  const organizationDetails = await getOrganizationDetails(organizationId);
  const projects = await getProjectsByOrganizationId(organizationId);
  const title = "Organization Details";

  res.render("organizations", {
    title,
    organizations: organizationDetails,
  });
};

const showEditOrganizationForm = async (req, res) => {
  const organizationId = req.params.id;
  const organizationDetails = await getOrganizationDetails(organizationId);

  const title = "Edit Organization";
  res.render("edit-organization", { title, organizationDetails });
};

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Organization name must be between 3 and 150 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Organization description is required")
    .isLength({ max: 500 })
    .withMessage("Organization description cannot exceed 500 characters"),
  body("contactEmail")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Contact email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
];

// Function to handle the form submission

const processNewOrganizationForm = async (req, res) => {
  // Check for validation errors
  const results = validationResult(req);

  // Log the incoming form data to verify if it is empty
  console.log("INCOMING FORM DATA:", req.body);

  if (!results.isEmpty()) {
    // Destructure values from req.body to preserve user input
    const { name, description, contactEmail } = req.body;

    // Render the view again instead of redirecting to prevent losing data
    return res.render("new-organization", {
      title: "Add New Organization",
      errors: results.array(),
      errorMessages: "Validation failed. Please correct the fields below.", // 👈 Asegúrate de que esta línea esté idéntica
      successMessages: "",
      name,
      description,
      contactEmail,
    });
  }

  const { name, description, contactEmail } = req.body;
  const logoFilename = "placeholder-logo.png";

  try {
    // Wrap parameters into a single object wrapper expected by the model
    const organizationId = await createOrganization({
      name,
      description,
      contactEmail,
      logoFilename,
    });

    // Set the success message to flash memory storage
    req.flash("success", "Organization added successfully!");

    // Redirect to the newly created organization details using backticks
    return res.redirect(`/organizations/${organizationId}`);
  } catch (error) {
    // Catch database constraint rejections safely without crashing the server
    console.error("Database Insert Error:", error);
    req.flash("error", "Failed to add organization to the database.");
    return res.redirect("/new-organization");
  }
};

const showOrganizationsPage = async (req, res) => {
  const title = "Organizations";
  const organizations = await getAllOrganizations();
  // Add this inside showOrganizationsPage
  console.log("Database data structure:", organizations[0]);
  res.render("organizations", { title, organizations });
};

const showNewOrganizationForm = async (req, res) => {
  const title = "Add New Organization";
  res.render("new-organization", { title });
};

const processEditOrganizationForm = async (req, res) => {
  const organizationId = req.params.id;
  const { name, description, contactEmail, logoFilename } = req.body;

  try {
    await updateOrganization(
      organizationId,
      name,
      description,
      contactEmail,
      logoFilename,
    );

    // Set a success flash message matching instructor sample
    req.flash("success", "Organization updated successfully!");

    // Redirect back to the organization details page
    res.redirect(`/organizations/${organizationId}`);
  } catch (error) {
    console.error("Error updating organization:", error);
    req.flash("error", "Failed to update organization.");
    res.redirect(`/edit-organization/${organizationId}`);
  }
};

export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm,
};
