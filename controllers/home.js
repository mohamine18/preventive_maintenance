exports.homePage = (req, res, next) => {
  res.render("index", {
    pageTitle: "Home Page",
    url: "/",
  });
};
