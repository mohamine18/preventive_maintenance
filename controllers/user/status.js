const { validationResult } = require("express-validator");

const errorhandler = require("../../util/errorHandler");
const catchAsync = require("../../util/catchAsync");

const Material = require("../../models/material");
const Status = require("../../models/status");
const Store = require("../../models/store");
const Visit = require("../../models/visit");

exports.getStatusRegistrationPage = catchAsync(async (req, res) => {
  const material = await Material.findOne({
    _id: req.params.materialId,
  }).select("_id name store");

  res.render("status/addStatus", {
    pageTitle: "Register a new status",
    errors: null,
    url: null,
    body: null,
    material,
    visitId: req.params.visitId,
  });
});

exports.statusRegister = catchAsync(async (req, res) => {
  const material = await Material.findOne({
    _id: req.params.materialId,
  }).select("_id name store");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("status/addStatus", {
      pageTitle: "Register a new status",
      errors: errorhandler(errors.errors[0].msg, "danger"),
      url: null,
      body: req.body,
      material,
      visitId: req.params.visitId,
    });
  }
  // if all good proceed for registration on database
  console.log(material);
  const newStatus = new Status({
    cleanliness: req.body.clean,
    physicalState: req.body.physicalState,
    inverterAutonomy: req.body.inverter,
    antivirusStatus: req.body.antivirus,
    diskStatus: req.body.diskStatus,
    osState: req.body.osState,
    networkState: req.body.networkState,
    windowsLicense: req.body.windowsLicense,
    officeLicense: req.body.officeLicense,
    comment: req.body.comment,
    material: {
      materialId: material._id,
      materialName: material.name,
    },
    visit: req.params.visitId,
  });
  newStatus.save();
  req.flash("success", "Status created successfully");
  res.redirect(`/visit/${req.params.visitId}/status`);
});
