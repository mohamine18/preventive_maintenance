const { validationResult } = require("express-validator");

const errorhandler = require("../../util/errorHandler");
const catchAsync = require("../../util/catchAsync");

const User = require("../../models/user");
const Store = require("../../models/store");
const Visit = require("../../models/visit");

exports.getVisitRegistrationPage = catchAsync(async (req, res) => {
  const stores = await Store.find().select("_id name");
  res.render("visit/register", {
    pageTitle: "Create a new visit",
    errors: null,
    url: "/visit/register",
    stores,
  });
});

exports.visitRegister = catchAsync(async (req, res) => {
  const stores = await Store.find().select("_id name");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("visit/register", {
      pageTitle: "Create a new visit",
      errors: errorhandler(errors.errors[0].msg, "danger"),
      url: "/visit/register",
      stores,
    });
  }
  const store = stores.find((elem) => elem._id.toString() === req.body.store);
  const newVisit = new Visit({
    comment: req.body.comment,
    user: {
      userId: req.user._id,
      userName: req.user.name,
    },
    store: {
      storeId: store._id,
      storeName: store.name,
    },
  });
  newVisit.save();
  req.flash("success", "Visit created successfully");
  res.redirect("/");
});
