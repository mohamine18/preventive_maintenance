const { validationResult } = require("express-validator");

const errorhandler = require("../util/errorHandler");

exports.getRegistrationPage = (req, res) => {
  res.render("authentication/register", {
    pageTitle: "Register a new user",
    canView: req.canView,
    errors: null,
    url: "/admin/register",
    body: null,
  });
};

exports.register = (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    res.render("authentication/register", {
      pageTitle: "Register a new user",
      canView: req.canView,
      errors: errorhandler(errors.errors[0].msg, "danger"),
      url: "/admin/register",
      body: req.body,
    });
  }
  res.render("authentication/register", {
    pageTitle: "Register a new user",
    canView: req.canView,
    errors: null,
    url: "/admin/register",
    body: null,
    errors: errorhandler("User created with success", "success"),
  });
};
