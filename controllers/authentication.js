const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");

const errorhandler = require("../util/errorHandler");
const catchAsync = require("../util/catchAsync");

const User = require("../models/user");

exports.getLoginPage = (req, res) => {
  res.render("authentication/login", {
    pageTitle: "Login Page",
    csrfToken: req.csrfToken(),
    errors: null,
  });
};

exports.login = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("authentication/login", {
      pageTitle: "Login Page",
      csrfToken: req.csrfToken(),
      errors: errorhandler(errors.errors[0].msg, "danger"),
    });
  }
  const user = await User.findOne({
    email: req.body.email,
    active: true,
  }).select("email role func password");

  if (!user) {
    return res.render("authentication/login", {
      pageTitle: "Login Page",
      csrfToken: req.csrfToken(),
      errors: errorhandler("No user found with provided email", "danger"),
    });
  }

  const result = await bcrypt.compare(req.body.password, user.password);

  if (!result) {
    return res.render("authentication/login", {
      pageTitle: "Login Page",
      csrfToken: req.csrfToken(),
      errors: errorhandler("Wrong password please try again", "danger"),
    });
  }
  const { _id, email, role, func } = user;
  req.session.isLoggedIn = true;
  req.session.user = { _id, email, role, func };
  req.session.save();
  if (role === "admin") {
    return res.redirect("/admin");
  }
  res.redirect("/");
});

exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/auth/login");
};

exports.redirectLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  }
  next();
};

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/auth/login");
  }
  const user = await User.findById(req.session.user);
  req.user = user;
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
