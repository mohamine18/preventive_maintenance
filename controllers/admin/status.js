const moment = require("moment");
const catchAsync = require("../../util/catchAsync");
const { getBadge } = require("../../util/filterBadges");
const { pagination } = require("../../util/pagination");

const Store = require("../../models/store");
const Visit = require("../../models/visit");
const Status = require("../../models/status");

exports.getListStatuses = catchAsync(async (req, res) => {
  const excludeFilter = ["store", "_csrf"];
  // const queryObj = { ...req.body };
  const queryObj = !req.query ? { ...req.body } : { ...req.query };
  Object.keys(queryObj).forEach((key) => {
    if (excludeFilter.includes(key)) {
      delete queryObj[key];
    }
  });

  // Pagination
  const page = +req.query.page || 1;
  if (typeof page !== "number" || page < 0) {
    req.flash("danger", "Page can't be found, Please try again later");
    return res.redirect("/admin/statuses");
  }
  const pages = page - 1;

  //Queries
  const statuses = await Status.find(queryObj)
    .skip(pages * process.env.LINES_PER_PAGE)
    .limit(process.env.LINES_PER_PAGE)
    .sort("-createdAt");
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
    queryParams: getBadge(queryObj, "statuses"),
    stores,
    materialUrl: `${req.protocol}://${req.get("host")}/api/v1/materials`,
    error: req.flash("danger")[0],
    success: req.flash("success")[0],
    paginate: pagination(page, queryCount),
  });
});
