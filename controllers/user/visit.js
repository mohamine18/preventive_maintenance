const { validationResult } = require("express-validator");

const errorhandler = require("../../util/errorHandler");
const catchAsync = require("../../util/catchAsync");

const Status = require("../../models/status");
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
  const visitExist = await Visit.findOne({
    "store.storeId": store._id,
    "user.userId": req.user._id,
    state: "open",
  }).exec();

  if (visitExist) {
    return res.render("visit/register", {
      pageTitle: "Create a new visit",
      errors: errorhandler("Visit already exist", "danger"),
      url: "/visit/register",
      stores,
    });
  }
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

exports.getVisitStatusList = catchAsync(async (req, res) => {
  const statuses = await Status.find({
    visit: req.params.visitId,
    active: true,
  });
  //subtract materials already have a status active
  const visit = await Visit.findOne({ _id: req.params.visitId }).exec(); // check for no visit
  const { materials } = await Store.findOne({
    _id: visit.store.storeId,
  }).select("materials");

  res.render("visit/status", {
    pageTitle: `${visit.store.storeName} materials Statuses`,
    url: null,
    visitId: req.params.visitId,
    statuses,
    materials: materials,
    error: req.flash("danger")[0],
    success: req.flash("success")[0],
  });
});
