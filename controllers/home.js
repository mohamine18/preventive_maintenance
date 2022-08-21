exports.homePage = (req, res) => {
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
