exports.homePage = (req, res) => {
  res.render("index", {
    pageTitle: "Home Page",
    canView: req.canView,
    url: "/",
  });
};
