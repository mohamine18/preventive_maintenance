const moment = require("moment");

const catchAsync = require("../util/catchAsync");

const Material = require("../models/material");
const Visit = require("../models/visit");

exports.homePage = catchAsync(async (req, res) => {
  const visits = await Visit.find({
    "user.userId": req.user._id,
    state: "open",
  }).select("user store createdAt status");

  const newVisits = await Promise.all(
    visits.map(async (elem) => {
      const { _id, user, store, createdAt, status } = elem; //destructuring a visit
      const date = moment(createdAt).format("dddd DD-MM-YYYY"); // formatting date using moment js
      const duration = moment(createdAt).fromNow(true); // calculating the date difference
      const materials = await Material.find({
        "store.storeId": store.storeId,
        used: true,
      }).select("_id");
      const materialsNumber = materials.length; // calculating the length of materials array inside a store
      const statusNumber = status.length;

      return {
        _id,
        user,
        store,
        date,
        materialsNumber,
        statusNumber,
        duration,
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
