const moment = require("moment");

const { validationResult } = require("express-validator");

const errorhandler = require("../../util/errorHandler");
const catchAsync = require("../../util/catchAsync");

const User = require("../../models/user");
const Store = require("../../models/store");
const Visit = require("../../models/visit");

exports.getListVisits = catchAsync(async (req, res) => {
  const visits = await Visit.find();
  const stores = await Store.find().select("_id name");
  const users = await User.find().select("_id name");

  const editedVisits = visits.map((visit) => {
    const { _id, state, closingDate, user, store, createdAt } = visit;
    const openDate = moment(createdAt).format("YYYY-MM-DD");
    const closeDate = moment(closingDate).format("YYYY-MM-DD");
    const durationCalc = moment(createdAt).fromNow(true);
    return {
      _id,
      state,
      createdAt: openDate,
      closingDate: closingDate ? closeDate : "Processing...",
      duration: durationCalc,
      user,
      store,
    };
  });

  res.render("admin/visits/visits", {
    pageTitle: "List of visits",
    url: "/admin/visits",
    visits: editedVisits,
    stores,
    users,
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
