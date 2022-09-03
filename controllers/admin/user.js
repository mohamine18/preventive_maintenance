const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");

const errorhandler = require("../../util/errorHandler");
const catchAsync = require("../../util/catchAsync");

const User = require("../../models/user");

exports.getUserRegistrationPage = (req, res) => {
  res.render("admin/users/register", {
    pageTitle: "Register a new user",
    errors: null,
    url: "/admin/users",
    body: null,
  });
};

exports.userRegister = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/users/register", {
      pageTitle: "Register a new user",
      errors: errorhandler(errors.errors[0].msg, "danger"),
      url: "/admin/users",
      body: req.body,
    });
  }
  const user = await User.findOne({ email: req.body.email }).exec();
  if (user) {
    return res.render("admin/users/register", {
      pageTitle: "Register a new user",
      errors: errorhandler("Email address already used", "warning"),
      url: "/admin/users",
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
  req.flash("success", "Account created successfully");
  res.redirect("/admin/users");
});

exports.getListUsers = catchAsync(async (req, res) => {
  const users = await User.find().select("name email role func");
  res.render("admin/users/users", {
    pageTitle: "List of users",
    url: "/admin/users",
    users,
    error: req.flash("danger")[0],
    success: req.flash("success")[0],
  });
});

exports.getUserForm = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId });
  if (!user) {
    req.flash("danger", "Account can't be found, Please try again later");
    res.redirect("/admin/users");
  }
  res.render("admin/users/editUser", {
    pageTitle: "Edit an account",
    url: "/admin/users",
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
    return res.render("admin/users/editUser", {
      pageTitle: "Edit an account",
      errors: errorhandler(errors.errors[0].msg, "danger"),
      url: "/admin/users",
      user,
    });
  }
  if (req.body.changePassword === "on") {
    if (req.body.password.length !== 8) {
      return res.render("admin/users/editUser", {
        pageTitle: "Edit an account",
        errors: errorhandler(
          "Please enter a valid password with minimum of 8 letters and numbers",
          "danger"
        ),
        url: "/admin/users",
        user,
      });
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.render("admin/users/editUser", {
        pageTitle: "Edit an account",
        errors: errorhandler(
          "Confirm password is not matching the password",
          "danger"
        ),
        url: "/admin/users",
        user,
      });
    }
    const hashedPassword = await bcrypt.hash(
      req.body.password,
      +process.env.SALT_ROUND
    );
    const editUser = {
      name: req.body.name,
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
    role: req.body.role,
    func: req.body.func,
  };
  await User.findByIdAndUpdate(req.params.userId, editUser);
  req.flash("success", "Account updated successfully");
  res.redirect("/admin/users");
});

exports.deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.userId, {
    active: false,
  });
  req.flash("success", `Account ${user.name} deleted successfully`);
  res.redirect("/admin/users");
});
