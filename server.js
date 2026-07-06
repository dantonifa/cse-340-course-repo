import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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
app.set("views", path.join(__dirname, "views"));

// Serve static files like CSS and images from the public folder
app.use(express.static(path.join(__dirname, "public")));
// Home Route - Renders index.ejs
app.get("/", (req, res) => {
  res.render("index");
});

// Organizations Route - Renders organizations.ejs
app.get("/organizations", (req, res) => {
  res.render("organizations");
});

// Services Route - Renders services.ejs
app.get("/services", (req, res) => {
  res.render("services");
});

// Start the server listener
app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
