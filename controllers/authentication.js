const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");

const errorhandler = require("../util/errorHandler");

const User = require("../models/user");

exports.getLoginPage = (req, res) => {
  res.render("authentication/login", {
    pageTitle: "Login Page",
    errors: null,
  });
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("authentication/login", {
      pageTitle: "Login Page",
      errors: errorhandler(errors.errors[0].msg, "danger"),
    });
  }

  const user = await User.findOne({ email: req.body.email }).select(
    "email role password"
  );
  if (!user) {
    return res.render("authentication/login", {
      pageTitle: "Login Page",
      errors: errorhandler("No user found with provided email", "danger"),
    });
  }
  result = await bcrypt.compare(req.body.password, user.password);
  if (!result) {
    return res.render("authentication/login", {
      pageTitle: "Login Page",
      errors: errorhandler("Wrong password please try again", "danger"),
    });
  }
  req.session.isLoggedIn = true;
  req.session.user = user;
  req.session.save((err) => {
    res.redirect("/");
  });
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/auth/login");
  });
};

exports.hasPermission = (req, res, next) => {
  const role = "admin"; // Roles are fetched from the database
  if (role === "admin") {
    res.locals.canView = true;
  }
  if (role === "user") {
    res.locals.canView = false;
  } // This will change after implementing RBAC or ABAC
  // TODO: in this step we can implement canView, canRead, canWrite ..etc
  next();
};

exports.redirectLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  }
  next();
};

exports.isLoggedIn = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/auth/login");
  }
  User.findById(req.session.user)
    .then((user) => {
      req.user = user;
      res.locals.isAuthenticated = req.session.isLoggedIn;
      next();
    })
    .catch((err) => console.log(err));
};
