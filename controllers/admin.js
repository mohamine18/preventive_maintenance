const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");

const errorhandler = require("../util/errorHandler");

const User = require("../models/user");

exports.getRegistrationPage = (req, res) => {
  if (res.locals.canView === false) {
    return res.redirect("/");
  }
  res.render("authentication/register", {
    pageTitle: "Register a new user",
    errors: null,
    url: "/admin/register",
    body: null,
  });
};

exports.register = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.render("authentication/register", {
      pageTitle: "Register a new user",
      errors: errorhandler(errors.errors[0].msg, "danger"),
      url: "/admin/register",
      body: req.body,
    });
  }
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      return res.render("authentication/register", {
        pageTitle: "Register a new user",
        errors: errorhandler("Email address is used", "danger"),
        url: "/admin/register",
        body: req.body,
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      function: req.body.function,
      password: hashedPassword,
    });
    newUser.save();
    // res.render("admin/users", {
    //   pageTitle: "List of users",
    //   url: "/admin/users",
    //   errors: errorhandler("User created with success", "success"),
    // });
  } catch (error) {
    console.log(error);
  }
};
