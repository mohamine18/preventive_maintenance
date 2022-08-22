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
