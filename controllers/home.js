const moment = require("moment");
const { validationResult } = require("express-validator");

const errorhandler = require("../util/errorHandler");
const catchAsync = require("../util/catchAsync");

const User = require("../models/user");
const Store = require("../models/store");
const Visit = require("../models/visit");

exports.homePage = catchAsync(async (req, res) => {
  const visits = await Visit.find({ "user.userId": req.user._id }).select(
    "user store createdAt"
  );

  const newVisits = await Promise.all(
    visits.map(async (elem) => {
      const { user, store, createdAt } = elem;

      const date = moment(createdAt).format("dddd DD-MM-YYYY");

      const daysAgo = moment(Date.now()).from(moment(createdAt), true);

      const shop = await Store.findOne({ _id: store.storeId });
      const materialsNumber = shop.materials.length;

      // calculate how many status we have
      const statusNumber = null;

      return {
        user,
        store,
        date,
        materialsNumber,
        statusNumber,
        daysAgo,
      };
    })
  );

  res.render("home", {
    pageTitle: "Home Page",
    url: "/",
    error: req.flash("danger")[0],
    success: req.flash("success")[0],
    visits: newVisits,
  });
});
