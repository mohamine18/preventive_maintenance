const { validationResult } = require("express-validator");

const errorhandler = require("../../util/errorHandler");
const catchAsync = require("../../util/catchAsync");

const Material = require("../../models/material");
const Status = require("../../models/status");
const Visit = require("../../models/visit");

exports.getStatusRegistrationPage = catchAsync(async (req, res) => {
  const material = await Material.findOne({
    _id: req.params.materialId,
  }).select("_id name store");
  if (!material) {
    req.flash("danger", "Material Can't be found, Please try again");
    res.redirect("/");
  }

  const visit = await Visit.findOne({
    _id: req.params.visitId,
  }).select("_id");
  if (!visit) {
    req.flash("danger", "Visit Can't be found, Please try again");
    res.redirect("/");
  }

  res.render("status/addStatus", {
    pageTitle: "Register a new status",
    errors: null,
    url: null,
    body: null,
    material,
    visitId: visit._id,
  });
});

exports.statusRegister = catchAsync(async (req, res) => {
  const material = await Material.findOne({
    _id: req.params.materialId,
  }).select("_id name store");
  if (!material) {
    req.flash("danger", "Material Can't be found, Please try again");
    res.redirect("/");
  }

  const visit = await Visit.findOne({ _id: req.params.visitId }).exec();
  if (!visit) {
    req.flash("danger", "Visit Can't be found, Please try again");
    res.redirect("/");
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("status/addStatus", {
      pageTitle: "Register a new status",
      errors: errorhandler(errors.errors[0].msg, "danger"),
      url: null,
      body: req.body,
      material,
      visitId: visit._id,
    });
  }

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

  const status = await newStatus.save();
  visit.addStatus(status._id);

  req.flash("success", "Status created successfully");
  res.redirect(`/visit/${visit._id}/statues`);
});

exports.getStatusForm = catchAsync(async (req, res) => {
  const status = await Status.findOne({ _id: req.params.statusId }).exec();
  if (!status) {
    req.flash("danger", "Status can't be found, Please try again");
    return res.redirect("/");
  }

  const visit = await Visit.findOne({ _id: status.visit }).exec();
  if (!visit) {
    req.flash("danger", "Visit Can't be found, Please try again");
    res.redirect("/");
  }

  res.render("status/editStatus", {
    pageTitle: "Edit a status",
    errors: null,
    url: null,
    status,
    visit,
  });
});

exports.editStatus = catchAsync(async (req, res) => {
  const status = await Status.findOne({ _id: req.params.statusId }).exec();
  if (!status) {
    req.flash("danger", "Status can't be found, Please try again");
    return res.redirect("/");
  }
  const updatedStatus = {
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
  };
  const newStatus = await Status.findByIdAndUpdate(
    req.params.statusId,
    updatedStatus,
    { new: true }
  );

  req.flash(
    "success",
    `${newStatus.material.materialName} Status updated successfully`
  );
  res.redirect(`/visit/${newStatus.visit}/statues`);
});
