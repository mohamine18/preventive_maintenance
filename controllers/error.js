exports.pageNotFound = (req, res, next) => {
  const err = new Error("404 Page Not Found");
  err.statusCode = 404;
  throw err;
};

exports.globalErrorhandler = (err, req, res, next) => {
  if (err.statusCode === 404) {
    return res.render("notFound", {
      pageTitle: "404 Page not found",
    });
  }
  console.log("error from global error handler =>", err);
  res.render("serverError", {
    pageTitle: "500 Server Error",
  });
};
