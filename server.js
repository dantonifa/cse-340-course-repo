// import the flash middleware at the top:
import flash from "./src/middleware/flash.js";
import session from "express-session";
import baseRoute from "./src/routes.js";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// Add "src/" to your import paths
import db from "./src/models/db.js";

// Load environment variables from your .env file
dotenv.config();

// Setup __dirname workaround required for ES Modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SESSION_SECRET = process.env.SESSION_SECRET;
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3000;

const app = express();

// Allow Express to receive and process common POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files like CSS and images from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Tell Express where to find your templates
app.set("views", path.join(__dirname, "src/views"));

// Set up session management
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 },
  }),
);

// Use flash message middleware
app.use(flash);

// Middleware to pass flash messages to all EJS views locally
app.use((req, res, next) => {
  const flashMessages = req.flash();
  res.locals.messages = flashMessages;
  res.locals.notice =
    flashMessages.notice && flashMessages.notice.length > 0
      ? flashMessages.notice[0]
      : null;
  next();
});
// Middleware to log all incoming requests
app.use((req, res, next) => {
  if (NODE_ENV === "development") {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});

// Middleware to make NODE_ENV available to all templates
//Add code to this function to set a new variable res.locals.isLoggedIn
// that is true if req.session.user exists, otherwise false.
app.use((req, res, next) => {
  res.locals.isLoggedIn = false;
  if (req.session && req.session.user) {
    res.locals.isLoggedIn = true;
  }

  res.locals.NODE_ENV = NODE_ENV;
  next();
});

// Middleware to make locale available to all views
app.use((req, res, next) => {
  res.locals.NODE_ENV = process.env.NODE_ENV;
  next();
});

// Middleware to parse incoming HTML form data into req.body
app.use(express.urlencoded({ extended: true }));

// Use the router for all routes

// app.use("/", staticRoute);
app.use("/", baseRoute);

// Catch-all route for 404 errors

app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  // Log error details for debugging
  console.error("Error occurred:", err.message);
  console.error("Stack trace:", err.stack);

  // Determine status and template
  const status = err.status || 500;
  const template = status === 404 ? "404" : "500";

  // Prepare data for the template
  const context = {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error: err.message,
    stack: err.stack,
  };

  // Render the appropriate error template
  res.status(status).render(`errors/${template}`, context);
});

// Start the server listener
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
