const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");

const errorhandler = require("../util/errorHandler");

const User = require("../models/user");

exports.getRegistrationPage = (req, res) => {
  res.render("admin/register", {
    pageTitle: "Register a new user",
    errors: null,
    url: "/admin/register",
    body: null,
  });
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.render("admin/register", {
      pageTitle: "Register a new user",
      errors: errorhandler(errors.errors[0].msg, "danger"),
      url: "/admin/register",
      body: req.body,
    });
  }
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      return res.render("admin/register", {
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
    res.redirect("/admin/users");
  } catch (error) {
    console.log(error);
  }
};

exports.getListUsers = async (req, res) => {
  try {
    const users = await User.find({ active: true }).select(
      "name email role function"
    );
    res.render("admin/users", {
      pageTitle: "List of users",
      url: "/admin/users",
      users,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getUserForm = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    //flash message (user can't be found)
    return res.redirect("/admin/users");
  }
  try {
    const user = await User.findOne({ _id: req.params.userId });
    if (!user) {
      //flash message (user can't be found)
      res.redirect("/admin/users");
    }
    res.render("admin/editUser", {
      pageTitle: `User Account | ${user.name}`,
      url: "",
      errors: null,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.editUser = (req, res) => {
  console.log(req.body);
  // no email value because is disabled
  // checkbox value is "on" when checked
};

exports.deleteUser = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    //flash message (user can't be found)
    return res.redirect("/admin/users");
  }
  try {
    await User.findByIdAndUpdate(req.params.userId, { active: false });
  } catch (error) {
    console.log(error);
  }
  res.redirect("/admin/users");
};
