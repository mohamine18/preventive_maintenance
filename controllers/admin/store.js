const mongoose = require("mongoose");

const { validationResult } = require("express-validator");

const errorhandler = require("../../util/errorHandler");

const catchAsync = require("../../util/catchAsync");

const Store = require("../../models/store");

const { province } = require("../../util/provinces");

exports.getStoreRegistrationPage = (req, res) => {
  res.render("admin/stores/addStore", {
    pageTitle: "Create a new store",
    errors: null,
    url: "/admin/stores",
    body: null,
    province,
  });
};

exports.storeRegister = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/stores/addStore", {
      pageTitle: "Create a new store",
      errors: errorhandler(errors.errors[0].msg, "danger"),
      url: "/admin/stores",
      body: req.body,
      province,
    });
  }
  const provinceData = province.find((elem) => elem.id === req.body.province);
  const newStore = new Store({
    name: req.body.name,
    address: req.body.address,
    province: {
      code: provinceData.id,
      name: provinceData.name,
    },
  });
  newStore.save();
  req.flash("success", "Store created successfully");
  res.redirect("/admin/stores");
});

exports.getListStores = catchAsync(async (req, res) => {
  const stores = await Store.find({ active: true });
  res.render("admin/stores/stores", {
    pageTitle: "List of stores",
    url: "/admin/stores",
    stores,
    error: req.flash("danger")[0],
    success: req.flash("success")[0],
  });
});

exports.getStoreForm = catchAsync(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.storeId)) {
    req.flash("danger", "Store can't be found, Please try again later");
    return res.redirect("/admin/stores");
  }
  const store = await Store.findOne({ _id: req.params.storeId });
  if (!store) {
    req.flash("danger", "Store can't be found, Please try again later");
    res.redirect("/admin/stores");
  }
  res.render("admin/stores/editStore", {
    pageTitle: "Edit a store",
    url: "/admin/stores",
    errors: null,
    store,
    province,
  });
});

exports.editStore = catchAsync(async (req, res) => {
  const store = await Store.findOne({ _id: req.params.storeId });
  if (!store) {
    req.flash("danger", "Store can't be found, Please try again later");
    return res.redirect("/admin/stores");
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/stores/editStore", {
      pageTitle: "Edit a store",
      errors: errorhandler(errors.errors[0].msg, "danger"),
      url: "/admin/stores",
      store,
      province,
    });
  }
  const provinceData = province.find((elem) => elem.id === req.body.province);
  const editStore = {
    name: req.body.name,
    address: req.body.address,
    province: {
      code: provinceData.id,
      name: provinceData.name,
    },
  };
  await Store.findByIdAndUpdate(req.params.storeId, editStore);
  req.flash("success", "Store updated successfully");
  res.redirect("/admin/stores");
});

exports.deleteStore = catchAsync(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.storeId)) {
    req.flash("danger", "Couldn't delete the store Please try again later");
    return res.redirect("/admin/stores");
  }
  const store = await Store.findByIdAndUpdate(req.params.storeId, {
    active: false,
  });
  req.flash("success", `Account ${store.name} deleted successfully`);
  res.redirect("/admin/stores");
});
