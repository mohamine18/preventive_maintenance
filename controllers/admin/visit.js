const moment = require("moment");

const { validationResult } = require("express-validator");

const errorhandler = require("../../util/errorHandler");
const catchAsync = require("../../util/catchAsync");

const User = require("../../models/user");
const Store = require("../../models/store");
const Visit = require("../../models/visit");
const Status = require("../../models/status");

exports.getListVisits = catchAsync(async (req, res) => {
  const queryObj = { ...req.body };
  // delete empty date entries
  Object.keys(queryObj).forEach((key) => {
    if (queryObj[key] === "") {
      delete queryObj[key];
    }
  });
  //create date entries from the queryObj
  const dateObj = { createdAt: {}, closingDate: {} };
  Object.entries(queryObj).map((item) => {
    if (item[0] === "createdFrom") {
      Object.assign(dateObj.createdAt, { $gte: new Date(item[1]) });
    }
    if (item[0] === "createdTo") {
      Object.assign(dateObj.createdAt, { $lt: new Date(item[1]) });
    }
    if (item[0] === "closedFrom") {
      Object.assign(dateObj.closingDate, { $gte: new Date(item[1]) });
    }
    if (item[0] === "closedTo") {
      Object.assign(dateObj.closingDate, { $lt: new Date(item[1]) });
    }
    return;
  });

  // delete keys of queryObj included in the words array
  const dateWords = [
    "createdFrom",
    "createdTo",
    "closedFrom",
    "closedTo",
    "_csrf",
  ];
  Object.keys(queryObj).forEach((key) => {
    if (dateWords.includes(key)) {
      delete queryObj[key];
    }
  });

  // delete date entries if empty
  Object.entries(dateObj).map((item) => {
    if (Object.keys(item[1]).length === 0) {
      delete dateObj[item[0]];
    }
    return;
  });

  const filterObj = { ...queryObj, ...dateObj };

  const visits = await Visit.find(filterObj);
  const queryCount = await Visit.find(filterObj).countDocuments();
  const stores = await Store.find().select("_id name");
  const users = await User.find().select("_id name");

  const editedVisits = visits.map((visit) => {
    const { _id, state, closingDate, user, store, createdAt, duration } = visit;
    const openDate = moment(createdAt).format("YYYY-MM-DD");
    const closeDate = moment(closingDate).format("YYYY-MM-DD");
    const durationCalc = moment(createdAt).fromNow(true);
    return {
      _id,
      state,
      createdAt: openDate,
      closingDate: closingDate ? closeDate : "Processing...",
      duration: duration ? duration : durationCalc,
      user,
      store,
    };
  });

  res.render("admin/visits/visits", {
    pageTitle: "List of visits",
    url: "/admin/visits",
    data: editedVisits,
    stores,
    users,
    dataCount: queryCount,
    queryParams: req.body,
    error: req.flash("danger")[0],
    success: req.flash("success")[0],
  });
});

exports.deleteVisit = catchAsync(async (req, res) => {
  const visit = await Visit.findByIdAndUpdate(req.params.visitId, {
    active: false,
  });
  req.flash(
    "success",
    `Visit of ${visit.store.storeName} created by ${visit.user.userName} deleted successfully`
  );
  res.redirect("/admin/visits");
});

exports.getListStatues = catchAsync(async (req, res) => {
  const visit = await Visit.findOne({ _id: req.params.visitId });
  if (!visit) {
    req.flash("danger", "Visit can't be found, Please try again later");
    return res.redirect("/admin/visits");
  }
  const statues = await Status.find({ visit: visit._id });
  const statuesCount = await Status.find({
    visit: req.params.visitId,
  }).countDocuments();

  res.render("admin/visits/visitStatues", {
    pageTitle: "Visit Statues",
    url: `admin/visit/${visit._id}/statues`,
    data: statues,
    dataCount: statuesCount,
  });
});
