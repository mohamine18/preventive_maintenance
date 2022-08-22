exports.homePage = (req, res, next) => {
  next(new Error("not found"));
  res.render("index", {
    pageTitle: "Home Page",
    url: "/",
  });
};

exports.notFound = (req, res, next) => {
  res.render("notFound", {
    pageTitle: "404 Page not found",
  });
};

exports.globalError = (err, req, res) => {
  res.render("serverError", {
    pageTitle: "500 Server Error",
  });
};
