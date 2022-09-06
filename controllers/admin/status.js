const moment = require("moment");
const catchAsync = require("../../util/catchAsync");

const Store = require("../../models/store");
const Visit = require("../../models/visit");
const Status = require("../../models/status");

exports.getListStatuses = catchAsync(async (req, res) => {
  const excludeFilter = ["store", "_csrf"];
  const queryObj = { ...req.body };
  Object.keys(queryObj).forEach((key) => {
    if (excludeFilter.includes(key)) {
      delete queryObj[key];
    }
  });
  const statuses = await Status.find(queryObj).sort("-createdAt");
  const queryCount = await Status.find(queryObj).countDocuments();
  const stores = await Store.find().select("_id name");

  const editedStatuses = await Promise.all(
    statuses.map(async (state) => {
      const visit = await Visit.findOne({ _id: state.visit });
      const date = moment(visit.createdAt).format("YYYY-MM-DD");
      return {
        ...state._doc,
        storeName: visit.store.storeName,
        date,
      };
    })
  );

  res.render("admin/status/statuses", {
    pageTitle: "List of Statuses",
    url: "/admin/statuses",
    data: editedStatuses,
    dataCount: queryCount,
    queryParams: queryObj,
    stores,
    materialUrl: `${req.protocol}://${req.get("host")}/api/v1/materials`,
    error: req.flash("danger")[0],
    success: req.flash("success")[0],
  });
});
