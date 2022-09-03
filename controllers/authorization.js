const mongoose = require("mongoose");

exports.hasPermission = (req, res, next) => {
  const { role } = req.user;
  // console.log(req.originalUrl);
  if (role === "admin") {
    res.locals.canView = true;
  }
  if (role === "user") {
    res.locals.canView = false;
  } // This will change after implementing RBAC or ABAC
  // TODO: in this step we can implement canView, canRead, canWrite ..etc
  next();
};

exports.isNotAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.redirect("/");
  }
  next();
};

exports.checkValidObjectId = (req, res, next) => {
  const params = Object.values(req.params);
  for (const param of params) {
    if (!mongoose.isValidObjectId(param)) {
      req.flash("danger", "501 - Not Implemented, Please try again");
      return res.redirect("/");
    }
  }
  next();
};
