import db from "./db.js";
import bcrypt from "bcrypt";
/** 

* Insert a new user into the database with the default 'user' role (role_id = 1)
*/
const createUser = async (name, email, password_hash) => {
  try {
    const sql =
      "INSERT INTO public.users (name, email, password_hash, role_id) VALUES ($1, $2, $3, 1) RETURNING *;";
    const result = await db.query(sql, [name, email, password_hash]);
    return result.rows;
  } catch (error) {
    console.error("Error inserting user into model:", error.message);
    throw error;
  }
};

/*Create a function named findUserByEmail that accepts an email address 
as a parameter and returns the user from the database with that email.*/

const findUserByEmail = async (email) => {
  const query = `
  SELECT user_id, name, email, password_hash, role_id
  FROM users
  WHERE email = $1
`;

  const queryParams = [email];

  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    return null; // User not found
  }

  return result.rows[0];
};

/*Create a function named verifyPassword that accepts a plain text password
 and a hashed password as parameters. It then uses bcrypt.compare() to check
 if they match. Return true if they match, false if they do not. */

const verifyPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

/*Create a function named authenticateUser that takes an email and password as parameters. 
This function should:
Use findUserByEmail to get the user.
If no user is found, return null.
Use verifyPassword to check if the password is correct.
If the password is correct, remove the password_hash from the user 
object and return the user object. If not, return null.*/

const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const isPasswordValid = await verifyPassword(password, user.password_hash);
  if (!isPasswordValid) {
    return null;
  }

  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/*The only function the controller needs access to is the authenticateUser function, 
so make sure to export it, but you do not need to export the other two functions.*/

// Fetch all registered users along with their role descriptions
const getAllUsers = async () => {
  const query =
    "SELECT u.user_id, u.name, u.email, r.role_name AS role FROM public.users u JOIN public.roles r ON u.role_id = r.role_id ORDER BY u.name ASC;";
  // Replace 'pool' with the actual database connection name used in this file (e.g., db or pool)
  const result = await db.query(query);
  return result.rows;
};
// Add a volunteer to a project
const addVolunteer = async (userId, projectId) => {
  try {
    const sql =
      "INSERT INTO public.project_volunteer (user_id, project_id) VALUES ($1, $2) RETURNING *;";
    const result = await db.query(sql, [userId, projectId]);
    return result.rows;
  } catch (error) {
    console.error("Error adding volunteer:", error.message);
    throw error;
  }
};
// Remove a volunteer from a project
const removeVolunteer = async (userId, projectId) => {
  try {
    const sql =
      "DELETE FROM public.project_volunteer WHERE user_id = $1 AND project_id = $2 RETURNING *;";
    const result = await db.query(sql, [userId, projectId]);
    return result.rows;
  } catch (error) {
    console.error("Error removing volunteer:", error.message);
    throw error;
  }
};
// Retrieve all projects a specific user has volunteered for
const getProjectsByVolunteer = async (userId) => {
  try {
    const sql = "SELECT * FROM public.project_volunteer WHERE user_id = $1;";
    const result = await db.query(sql, [userId]);
    return result.rows;
  } catch (error) {
    console.error("Error retrieving projects by volunteer:", error.message);
    throw error;
  }
};
// Export them together at the bottom of the file
export {
  removeVolunteer,
  getProjectsByVolunteer,
  authenticateUser,
  createUser,
  findUserByEmail,
  verifyPassword,
  getAllUsers,
  addVolunteer,
};
