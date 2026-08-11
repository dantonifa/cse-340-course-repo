// Import any needed model functions

import { body, validationResult } from "express-validator";

import {
  getAllCategories,
  getCategoriesByServiceProjectId,
  updateCategoryAssignments,
  getCategoryById,
  createCategory,
  updateCategory,
} from "../models/categories.js";

import { getProjectDetails } from "../models/projects.js";

/*Create a new function showAssignCategoriesForm. Get the projectId from the request parameters.
This function should retrieve the project details using the existing getProjectDetails model function.
(You will likely need to add this to your list of imports from the project model file).
It should also retrieve all categories using the existing getAllCategories model function.
Additionally, it should retrieve the categories currently assigned to the project using 
the existing getCategoriesByServiceProjectId model function. (You will likely need to add 
this to your list of imports from the categories model file.) It should set the title variable to be,
"Assign Categories to Project". Finally, it should render a view assign-categories 
(to be created in the next step) and pass the project details, all categories, 
and the assigned categories to the view.*/

const showAssignCategoriesForm = async (req, res) => {
  const { projectId } = req.params;
  const project = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByServiceProjectId(projectId);
  const title = "Assign Categories to Project";

  res.render("assign-categories", {
    title,
    projectId,
    projectTitle: project.title, // <-- Add this line to pass the project title
    categories,
    assignedCategoryIds: assignedCategories,
  });
};

/*Create a new function processAssignCategoriesForm.
Get the projectId from the request parameters.
Get the selected category IDs from the request body. (Assume the form field name is categories and it will be
an array of selected category IDs.) This function should call the updateCategoryAssignments model function you 
created in the previous step, passing in the projectId and the array of selected category IDs. 
(You will likely need to add this to your list of imports from the categories model file.)Set a success flash 
message.Redirect the user back to the project details page /project/{projectId}.*/

const processAssignCategoriesForm = async (req, res) => {
  const { projectId } = req.params;
  const selectedCategoryIds = req.body.categoryIds || [];
  await updateCategoryAssignments(projectId, selectedCategoryIds);
  req.flash("success", "Categories updated successfully.");
  res.redirect("/projects");
};

// Process the form submission for a new category
const processNewCategoryForm = async (req, res) => {
  // 1. Catch validation errors from the middleware
  const errors = validationResult(req);

  // 2. If there are errors (e.g. name length is less than 3), reload the form
  if (!errors.isEmpty()) {
    return res.render("new-category", {
      title: "Create New Category",
      errors: errors.array(),
      category_name: req.body.category_name, // Keep old input value
    });
  }

  try {
    const { category_name } = req.body;

    // 3. Call your model function to save the category to the database
    // (Ensure you have a function like addCategory in your model)
    await createCategory(category_name);

    req.flash("success", "Category created successfully.");
    res.redirect("/categories");
  } catch (error) {
    res.render("new-category", {
      title: "Create New Category",
      // Replace the generic string with the actual error message from the database:
      errors: [{ msg: error.message || "Unknown Database Error" }],
      category_name: req.body.category_name,
    });
  }
};

// Server-side validation rules for creating/editing categories
const categoryValidation = [
  body("category_name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters long."),
];

// Define any controller functions
const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = "Service Categories";

  res.render("categories", { title, categories });
};

// Display the new category form view
const showNewCategoryForm = async (req, res) => {
  res.render("new-category", {
    title: "Create New Category",
    errors: null,
  });
};

// Display the edit category form pre-populated with data
const showEditCategoryForm = async (req, res) => {
  try {
    const { id } = req.params;
    const singleCategory = await getCategoryById(id);

    if (!singleCategory) {
      return res.status(404).send("Category not found");
    }
    res.render("edit-category", {
      title: "Edit Category",
      errors: null,
      // Map db columns to what your EJS template expects
      category: {
        id: singleCategory.category_id,
        name: singleCategory.category_name,
      },
    });
  } catch (error) {
    // Keep the 500 status code, but render the visual EJS template with the real error message!
    res.status(500).render("edit-category", {
      title: "Edit Category",
      errors: [{ msg: error.message || "Unknown Database Error" }],
      category_name: req.body.category_name,
    });
  }
};

// Process the edit category form submission
const processEditCategoryForm = async (req, res) => {
  try {
    const { category_id, category_name } = req.body;
    const id = category_id;

    await updateCategory(id, category_name);
    res.redirect("/categories");
  } catch (error) {
    // Check if the error is a unique constraint violation
    let errorMsg = "Unknown error occurred";
    if (error.code === "23505" || error.message.includes("unique constraint")) {
      errorMsg =
        "Category name already exists. Please choose a different name.";
    } else if (error.message) {
      errorMsg = error.message;
    }

    res.status(500).render("edit-category", {
      title: "Edit Category",
      errors: [{ msg: errorMsg }],
      category: {
        id: req.params.id || req.body.category_id,
        name: req.body.category_name,
      },
    });
  }
};

// Export any controller functions
export {
  showCategoriesPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  categoryValidation,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
};
