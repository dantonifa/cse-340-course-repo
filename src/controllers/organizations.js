// Import any needed model functions
import {
  getAllOrganizations,
  getOrganizationDetails,
} from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";

// Define any controller functions
const showOrganizationDetailsPage = async (req, res) => {
  const organizationId = req.params.id;
  const organizationDetails = await getOrganizationDetails(organizationId);
  const projects = await getProjectsByOrganizationId(organizationId);
  const title = "Organization Details";

  res.render("organization", { title, organizationDetails, projects });
};

const showOrganizationsPage = async (req, res) => {
  const title = "Organizations";
  const organizations = await getAllOrganizations();
  res.render("organizations", { title, organizations });
};

// Export any controller functions
export { showOrganizationsPage, showOrganizationDetailsPage };
