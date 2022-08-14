exports.getLoginPage = (req, res) => {
  res.render("authentication/login", {
    pageTitle: "Login Page",
  });
};

exports.login = (req, res) => {
  console.log(req.body.email);
  console.log(req.body.password);
};
