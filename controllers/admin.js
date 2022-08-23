const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");

const errorhandler = require("../util/errorHandler");

const User = require("../models/user");
const catchAsync = require("../util/catchAsync");

exports.getRegistrationPage = (req, res) => {
  res.render("admin/register", {
    pageTitle: "Register a new user",
    errors: null,
    url: "/admin/register",
    body: null,
  });
};

exports.register = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/register", {
      pageTitle: "Register a new user",
      errors: errorhandler(errors.errors[0].msg, "danger"),
      url: "/admin/register",
      body: req.body,
    });
  }
  const user = await User.findOne({ email: req.body.email }).exec();
  if (user) {
    return res.render("admin/register", {
      pageTitle: "Register a new user",
      errors: errorhandler("Email address already used", "warning"),
      url: "/admin/register",
      body: req.body,
    });
  }
  const hashedPassword = await bcrypt.hash(
    req.body.password,
    +process.env.SALT_ROUND
  );
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    func: req.body.func,
    password: hashedPassword,
  });
  newUser.save();
  res.redirect("/admin/users");
});

exports.getListUsers = catchAsync(async (req, res) => {
  const users = await User.find({ active: true }).select(
    "name email role func"
  );
  res.render("admin/users", {
    pageTitle: "List of users",
    url: "/admin/users",
    users,
    error: req.flash("danger")[0],
    success: req.flash("success")[0],
  });
});

exports.getUserForm = catchAsync(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    req.flash("danger", "Account can't be found, Please try again later");
    return res.redirect("/admin/users");
  }
  const user = await User.findOne({ _id: req.params.userId });
  if (!user) {
    req.flash("danger", "Account can't be found, Please try again later");
    res.redirect("/admin/users");
  }
  res.render("admin/editUser", {
    pageTitle: "Edit an account",
    url: "",
    errors: null,
    user,
  });
});

exports.editUser = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  const user = await User.findOne({ _id: req.params.userId });
  if (!user) {
    req.flash("danger", "Account can't be found, Please try again later");
    return res.redirect("/admin/users");
  }
  if (!errors.isEmpty()) {
    return res.render("admin/editUser", {
      pageTitle: "Edit an account",
      errors: errorhandler(errors.errors[0].msg, "danger"),
      url: "",
      user,
    });
  }
  if (req.body.changePassword === "on") {
    if (req.body.password.length !== 8) {
      return res.render("admin/editUser", {
        pageTitle: "Edit an account",
        errors: errorhandler(
          "Please enter a valid password with minimum of 8 letters and numbers",
          "danger"
        ),
        url: "",
        user,
      });
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.render("admin/editUser", {
        pageTitle: "Edit an account",
        errors: errorhandler(
          "Confirm password is not matching the password",
          "danger"
        ),
        url: "",
        user,
      });
    }
    const hashedPassword = await bcrypt.hash(
      req.body.password,
      +process.env.SALT_ROUND
    );
    const editUser = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      func: req.body.func,
      password: hashedPassword,
    };
    await User.findByIdAndUpdate(req.params.userId, editUser);
    req.flash("success", "Account updated successfully");
    return res.redirect("/admin/users");
  }
  const editUser = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    func: req.body.func,
  };
  await User.findByIdAndUpdate(req.params.userId, editUser);
  req.flash("success", "Account updated successfully");
  res.redirect("/admin/users");
});

exports.deleteUser = catchAsync(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    req.flash("danger", "Couldn't delete the account Please try again later");
    return res.redirect("/admin/users");
  }
  await User.findByIdAndUpdate(req.params.userId, { active: false });
  req.flash("success", "Account deleted successfully");
  res.redirect("/admin/users");
});
