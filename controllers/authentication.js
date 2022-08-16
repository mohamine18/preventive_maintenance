const { validationResult } = require("express-validator");

const errorhandler = (msg, type) => {
  let alert;
  let dismissible;
  if (type === "danger") {
    alert = "Error!";
    dismissible = false;
  }
  if (type === "success") {
    alert = "Success!";
    dismissible = true;
  }
  return { alert, msg, type, dismissible };
};

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
