const catchAsync = require("../util/catchAsync");

const Material = require("../models/material");

exports.getMaterialsList = catchAsync(async (req, res) => {
  const { storeId } = req.query;
  const materials = await Material.find({ "store.storeId": storeId }).select(
    "_id name"
  );
  res.status(200).json({
    message: "success",
    data: materials,
  });
});
