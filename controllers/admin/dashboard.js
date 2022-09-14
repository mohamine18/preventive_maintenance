const catchAsync = require("../../util/catchAsync");

exports.getDashboard = catchAsync(async (req, res) => {
  res.send("this is a dashboard");
});
