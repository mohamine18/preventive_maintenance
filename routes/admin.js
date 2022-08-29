const express = require("express");

const router = express.Router();

const adminUserController = require("../controllers/admin/user");
const adminStoreController = require("../controllers/admin/store");
const adminMaterialController = require("../controllers/admin/material");

const authzController = require("../controllers/authorization");

const authValidator = require("../validators/authentication");
const storeValidator = require("../validators/store");
const materialValidator = require("../validators/material");

router.use(authzController.isNotAdmin);

// Routes of manipulating Users or Accounts
router
  .route("/user/register")
  .get(adminUserController.getUserRegistrationPage)
  .post(authValidator.userRegister, adminUserController.userRegister);

router.route("/users").get(adminUserController.getListUsers);

router
  .route("/user/:userId")
  .get(adminUserController.getUserForm)
  .post(authValidator.userEdit, adminUserController.editUser);

router.route("/user/delete/:userId").post(adminUserController.deleteUser);

// Routes of manipulating Stores
router
  .route("/store/register")
  .get(adminStoreController.getStoreRegistrationPage)
  .post(storeValidator.storeRegister, adminStoreController.storeRegister);

router.route("/stores").get(adminStoreController.getListStores);

router
  .route("/store/:storeId/materials")
  .get(adminStoreController.getStoreMaterialList);

router
  .route("/store/:storeId")
  .get(adminStoreController.getStoreForm)
  .post(storeValidator.storeRegister, adminStoreController.editStore);

router.route("/store/delete/:storeId").post(adminStoreController.deleteStore);

// Routes of manipulating Materials
router
  .route("/material/delete/:materialId")
  .post(adminMaterialController.deleteMaterial);

router
  .route("/material/register/:storeId")
  .get(adminMaterialController.getMaterialRegistrationPage)
  .post(
    materialValidator.materialRegister,
    adminMaterialController.materialRegister
  );

router
  .route("/material/:storeId/:materialId")
  .get(adminMaterialController.getMaterialForm)
  .post(
    materialValidator.materialRegister,
    adminMaterialController.editMaterial
  );

module.exports = router;
