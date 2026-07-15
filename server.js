import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// Add "src/" to your import paths
import db from "./src/models/db.js";
import { getAllOrganizations } from "./src/models/organizations.js";
import { getAllCategories } from "./src/models/categories.js";

// Load environment variables from your .env file
dotenv.config();

// Setup __dirname workaround required for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 3000;

const app = express();

// Configure the EJS template view engine for Step 1
app.set("view engine", "ejs");
// Change this line to include "src/views"
app.set("views", path.join(__dirname, "src/views"));

// Serve static files like CSS and images from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to log all incoming requests
app.use((req, res, next) => {
  if (NODE_ENV === "development") {
    console.log(`${req.method} ${req.url}`);
  }
  next(); // Pass control to the next middleware or route
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV;
  next();
});
/* ***********************
 * Routes with Dynamic Titles
 * *********************** */

// Home Route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Organizations Route (Dynamic with Database Fetch)
app.get("/organizations", async (req, res) => {
  // Fetch all records using the model function
  const organizations = await getAllOrganizations();
  console.log(organizations);

  const title = "Our Partner Organizations";
  // Pass both the title and the database results to the EJS template
  res.render("organizations", { title, organizations });
});

// Services Route
app.get("/services", (req, res) => {
  res.render("services", { title: "Services" });
});

// Projects Route
app.get("/projects", (req, res) => {
  res.render("projects", { title: "Projects" });
});

// Categories Route
app.get("/categories", async (req, res) => {
  const categories = await getAllCategories();
  res.render("categories", { title: "Categories", categories });
});

// Start the server listener
app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
