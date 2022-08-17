const { validationResult } = require("express-validator");

const errorhandler = require("../util/errorHandler");

exports.getLoginPage = (req, res) => {
  res.render("authentication/login", {
    pageTitle: "Login Page",
    errors: null,
  });
};

exports.login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("authentication/login", {
      pageTitle: "Login Page",
      errors: errorhandler(errors.errors[0].msg, "danger"),
    });
  }
  //TODO: Create a user model and fetch the data from it
  res.render("authentication/login", {
    pageTitle: "Login Page",
    errors: null,
  });
};

exports.hasPermission = (req, res, next) => {
  const role = "admin"; // Roles are fetched from the database
  if (role === "admin") {
    req.canView = true;
  }
  if (role === "user") {
    req.canView = false;
  } // This will change after implementing RBAC or ABAC
  // TODO: in this step we can implement canView, canRead, canWrite ..etc
  next();
};
