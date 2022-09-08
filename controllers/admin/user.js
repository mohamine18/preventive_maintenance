const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");

const errorhandler = require("../../util/errorHandler");
const catchAsync = require("../../util/catchAsync");

const User = require("../../models/user");
const Store = require("../../models/store");

exports.getUserRegistrationPage = catchAsync(async (req, res) => {
  const stores = await Store.find().select("_id name");
  res.render("admin/users/register", {
    pageTitle: "Register a new user",
    errors: null,
    url: "/admin/users",
    body: null,
    stores,
  });
});

exports.userRegister = catchAsync(async (req, res) => {
  const stores = await Store.find().select("_id name");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/users/register", {
      pageTitle: "Register a new user",
      errors: errorhandler(errors.errors[0].msg, "danger"),
      url: "/admin/users",
      body: req.body,
      stores,
    });
  }
  const user = await User.findOne({ email: req.body.email }).exec();
  if (user) {
    return res.render("admin/users/register", {
      pageTitle: "Register a new user",
      errors: errorhandler("Email address already used", "warning"),
      url: "/admin/users",
      body: req.body,
      stores,
    });
  }
  const hashedPassword = await bcrypt.hash(
    req.body.password,
    +process.env.SALT_ROUND
  );
  const store = await Store.findOne({ _id: req.body.store }).select("_id name");
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    func: req.body.func,
    store: { storeId: store._id, storeName: store.name },
    password: hashedPassword,
  });
  newUser.save();
  req.flash("success", "Account created successfully");
  res.redirect("/admin/users");
});

exports.getListUsers = catchAsync(async (req, res) => {
  const users = await User.find().select("name email role func store");
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
  const stores = await Store.find().select("_id name");
  if (!user) {
    req.flash("danger", "Account can't be found, Please try again later");
    res.redirect("/admin/users");
  }
  res.render("admin/users/editUser", {
    pageTitle: "Edit an account",
    url: "/admin/users",
    errors: null,
    user,
    stores,
  });
});

exports.editUser = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  const user = await User.findOne({ _id: req.params.userId });
  const stores = await Store.find().select("_id name");
  const store = await Store.findOne({ _id: req.body.store })
    .select("_id name")
    .exec();
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
      stores,
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
        stores,
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
        stores,
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
      store: { storeId: store._id, storeName: store.name },
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
    store: { storeId: store._id, storeName: store.name },
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
