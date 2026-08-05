//Import the bcrypt library using import bcrypt from 'bcrypt';.
import bcrypt from "bcrypt";
import { createUser, authenticateUser, getAllUsers } from "../models/users.js";

/*Create a showUserRegistrationForm controller function that renders 
 the registration form view register (which you will create in a future step).*/
const showUserRegistrationForm = (req, res) => {
  res.render("register", { title: "Register" });
};

/*Create a processUserRegistrationForm controller function to handle
 the registration logic of creating the new user, including hashing
 the password and saving the user.*/

const processUserRegistrationForm = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    // Create the user in the database
    const userId = await createUser(name, email, passwordHash);

    // Redirect to the home page after successful registration
    req.flash("success", "Registration successful! Please log in.");
    res.redirect("/");
  } catch (error) {
    console.error("Error registering user:", error);
    req.flash(
      "error",
      "An error occurred during registration. Please try again.",
    );
    res.redirect("/register");
  }
};

/*Create a function called showLoginForm that renders the login view.*/

const showLoginForm = (req, res) => {
  res.render("login", { title: "Login" });
};

/*Create a function called processLoginForm that does the following:
Gets the email and password from the request body.
Calls authenticateUser with the email and password.
Check to see if a user object is returned. If so:
Add the user object to the session object: req.session.user = user;.
Add a success flash message that the login was successful.
Add a console.log() statement to log the user in the console for debugging purposes.
Redirect to the home page.
If authentication fails (the function returns null):
Add an error flash message that the login failed.
Redirect the user back to the login page.*/
const processLoginForm = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    if (user) {
      // Store user info in session
      req.session.user = user;
      req.flash("success", "Login successful!");

      if (res.locals.NODE_ENV === "development") {
        console.log("User logged in:", user);
      }
      /*After the user successfully logs in and their information is 
      stored in the session, change the redirect to send them to /dashboard 
      instead of the root home page.*/
      res.redirect("/dashboard");
    } else {
      req.flash("error", "Invalid email or password.");
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error during login:", error);
    req.flash("error", "An error occurred during login. Please try again.");
    res.redirect("/login");
  }
};

/*Create a function called processLogout that does the following:
Destroys the session using req.session.destroy()
Adds a success flash message indicating the user has logged out.
Redirects the user to the login page.*/
const processLogout = async (req, res) => {
  if (req.session.user) {
    delete req.session.user;
  }

  req.flash("success", "Logout successful!");
  res.redirect("/login");
};

const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash("error", "You must be logged in to access that page.");
    return res.redirect("/login");
  }
  next();
};

/*Create a new function called showDashboard that:
Gets the user's name and email from req.session.user.
Renders the dashboard.ejs view and passes the name and 
email address to it.*/

const showDashboard = (req, res) => {
  const user = req.session.user;
  res.render("dashboard", {
    title: "Dashboard",
    name: user.name,
    email: user.email,
  });
};

// Middleware to restrict access based on user roles
const requireRole = (allowedRole) => {
  return (req, res, next) => {
    // Check if user is logged in and has the required role
    // Check if user is logged in and has the required role
    if (
      req.session.user &&
      (req.session.user.role === allowedRole || req.session.user.role_id === 2)
    ) {
      return next(); // User has the required role, proceed to the route
    }

    // User does not have permission, set flash message and redirect
    req.flash("error", "You do not have permission to access this page.");
    res.redirect("/login");
  };
};

/**
 * Render the registered users page for administration purposes
 */
const showUsersPage = async (req, res, next) => {
  try {
    const usersList = await getAllUsers();
    res.render("users", {
      title: "Registered Users Management",
      users: usersList,
    });
  } catch (error) {
    console.error("Failed to render users list page:", error);
    next(error);
  }
};

export {
  requireLogin,
  showDashboard,
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireRole,
  showUsersPage,
};
