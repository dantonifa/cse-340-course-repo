// Import any needed model functions
import {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
} from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";

// Define any controller functions
const showOrganizationDetailsPage = async (req, res) => {
  const organizationId = req.params.id;
  const organizationDetails = await getOrganizationDetails(organizationId);
  const projects = await getProjectsByOrganizationId(organizationId);
  const title = "Organization Details";

  res.render("organizations", {
    title,
    organizations: [
      {
        organization_id:
          organizationDetails.organization_id ||
          organizationDetails.organizationId,
        organization_name:
          organizationDetails.organization_name || organizationDetails.name,
        organization_description:
          organizationDetails.organization_description ||
          organizationDetails.description,
        organization_email:
          organizationDetails.organization_email ||
          organizationDetails.contactEmail ||
          organizationDetails.contact_email,
        organization_phone:
          organizationDetails.organization_phone ||
          organizationDetails.contactPhone ||
          organizationDetails.contact_phone,
      },
    ],
    projects,
  });
};
// Function to handle the form submission

const processNewOrganizationForm = async (req, res) => {
  const { name, description, contactEmail } = req.body;
  const logoFilename = "placeholder-logo.png"; // Use the placeholder logo for all new organizations

  const organizationId = await createOrganization({
    name,
    description,
    contactEmail,
    logoFilename,
  });

  // Set a success flash message
  req.flash("success", "Organization added successfully!");

  res.redirect(`/organizations/${organizationId}`);
};

const showOrganizationsPage = async (req, res) => {
  const title = "Organizations";
  const organizations = await getAllOrganizations();
  res.render("organizations", { title, organizations });
};

const showNewOrganizationForm = async (req, res) => {
  const title = "Add New Organization";
  res.render("new-organization", { title });
};

export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
};
