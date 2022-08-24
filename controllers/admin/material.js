const { validationResult } = require("express-validator");

const errorhandler = require("../../util/errorHandler");

const catchAsync = require("../../util/catchAsync");

const Material = require("../../models/material");
const Store = require("../../models/store");

exports.getMaterialRegistrationPage = catchAsync(async (req, res) => {
  const store = await Store.findOne({ _id: req.params.storeId }).select(
    "_id name"
  );
  if (!store) {
    req.flash("danger", "Store can't be found, Please try again");
    return res.redirect("/admin/stores");
  }
  res.render("admin/materials/addMaterial", {
    pageTitle: "Add a new material",
    errors: null,
    url: "",
    material: null,
    store,
  });
});

exports.materialRegister = catchAsync(async (req, res) => {
  const store = await Store.findOne({ _id: req.params.storeId });
  if (!store) {
    req.flash("danger", "Store can't be found, Please try again");
    return res.redirect("/admin/stores");
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/materials/addMaterial", {
      pageTitle: "Add a new material",
      errors: errorhandler(errors.errors[0].msg, "danger"),
      url: "",
      material: req.body,
      store,
    });
  }
  const newMaterial = new Material({
    category: req.body.category,
    name: req.body.name,
    inventoryCode: req.body.inventoryCode,
    acquisitionDate: req.body.acquisitionDate,
    comment: req.body.comment ? req.body.comment : "",
    store: {
      storeId: store._id,
      storeName: store.name,
    },
  });
  const addedMaterial = await newMaterial.save();
  store.addMaterial(addedMaterial);
  req.flash("success", "Material created successfully");
  res.redirect(`/admin/store/${store._id}/materials`);
});

exports.getMaterialForm = catchAsync(async (req, res) => {
  const store = await Store.findOne({ _id: req.params.storeId });
  if (!store) {
    req.flash("danger", "Store can't be found, Please try again");
    return res.redirect("/admin/stores");
  }

  const material = await Material.findOne({ _id: req.params.materialId });
  if (!material) {
    req.flash("danger", "Material can't be found, Please try again");
    return res.redirect(`/admin/store/${store._id}/materials`);
  }

  res.render("admin/materials/editMaterial", {
    pageTitle: "Edit a material",
    errors: null,
    url: "",
    material,
    store,
  });
});

exports.editMaterial = catchAsync(async (req, res) => {
  const store = await Store.findOne({ _id: req.params.storeId });
  if (!store) {
    req.flash("danger", "Store can't be found, Please try again");
    return res.redirect("/admin/stores");
  }

  const material = await Material.findOne({ _id: req.params.materialId });
  if (!material) {
    req.flash("danger", "Material can't be found, Please try again");
    return res.redirect(`/admin/store/${store._id}/materials`);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/materials/editMaterial", {
      pageTitle: "Edit a material",
      errors: errorhandler(errors.errors[0].msg, "danger"),
      url: "",
      store,
      material,
    });
  }

  const editMaterial = {
    category: req.body.category,
    name: req.body.name,
    inventoryCode: req.body.inventoryCode,
    acquisitionDate: req.body.acquisitionDate,
    comment: req.body.comment ? req.body.comment : "",
  };

  await Material.findByIdAndUpdate(req.params.materialId, editMaterial);
  req.flash("success", "Material updated successfully");
  return res.redirect(`/admin/store/${store._id}/materials`);
});

exports.deleteMaterial = catchAsync(async (req, res) => {
  const material = await Material.findByIdAndUpdate(req.params.materialId, {
    active: false,
  });
  req.flash(
    "success",
    `${material.store.storeName} => ${material.name} => deleted successfully`
  );
  return res.redirect(`/admin/store/${material.store.storeId}/materials`);
});
