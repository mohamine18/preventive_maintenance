const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");

const errorhandler = require("../util/errorHandler");

const User = require("../models/user");

exports.getLoginPage = (req, res) => {
  res.render("authentication/login", {
    pageTitle: "Login Page",
    csrfToken: req.csrfToken(),
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

  try {
    const user = await User.findOne({
      email: req.body.email,
      active: true,
    }).select("email role password");
    console.log("this is user", user);
    if (!user) {
      return res.render("authentication/login", {
        pageTitle: "Login Page",
        csrfToken: req.csrfToken(),
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
    const { _id, email, role } = user;
    req.session.isLoggedIn = true;
    req.session.user = { _id, email, role };
    req.session.save((err) => {
      res.redirect("/");
    });
  } catch (error) {
    console.log(error);
  }
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/auth/login");
  });
};

exports.hasPermission = (req, res, next) => {
  const role = req.user.role;
  // console.log(req.originalUrl);
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

exports.isLoggedIn = async (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/auth/login");
  }
  try {
    const user = await User.findById(req.session.user);
    req.user = user;
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  } catch (error) {
    console.log(error);
  }
};
