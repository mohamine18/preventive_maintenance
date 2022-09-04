const express = require("express");

const router = express.Router();

const adminUserController = require("../controllers/admin/user");
const adminStoreController = require("../controllers/admin/store");
const adminMaterialController = require("../controllers/admin/material");
const adminVisitController = require("../controllers/admin/visit");

const {
  isNotAdmin,
  checkValidObjectId,
} = require("../controllers/authorization");

const authValidator = require("../validators/authentication");
const storeValidator = require("../validators/store");
const materialValidator = require("../validators/material");

router.use(isNotAdmin);

// Routes of manipulating Users or Accounts
router
  .route("/user/register")
  .get(adminUserController.getUserRegistrationPage)
  .post(authValidator.userRegister, adminUserController.userRegister);

router.route("/users").get(adminUserController.getListUsers);

router
  .route("/user/:userId")
  .get(checkValidObjectId, adminUserController.getUserForm)
  .post(
    checkValidObjectId,
    authValidator.userEdit,
    adminUserController.editUser
  );

router
  .route("/user/delete/:userId")
  .post(checkValidObjectId, adminUserController.deleteUser);

// Routes of manipulating Stores
router
  .route("/store/register")
  .get(adminStoreController.getStoreRegistrationPage)
  .post(storeValidator.storeRegister, adminStoreController.storeRegister);

router.route("/stores").get(adminStoreController.getListStores);

router
  .route("/store/:storeId/materials")
  .get(checkValidObjectId, adminStoreController.getStoreMaterialList);

router
  .route("/store/:storeId")
  .get(checkValidObjectId, adminStoreController.getStoreForm)
  .post(
    checkValidObjectId,
    storeValidator.storeRegister,
    adminStoreController.editStore
  );

router
  .route("/store/delete/:storeId")
  .post(checkValidObjectId, adminStoreController.deleteStore);

// Routes of manipulating Materials
router
  .route("/material/delete/:materialId")
  .post(checkValidObjectId, adminMaterialController.deleteMaterial);

router
  .route("/material/register/:storeId")
  .get(checkValidObjectId, adminMaterialController.getMaterialRegistrationPage)
  .post(
    checkValidObjectId,
    materialValidator.materialRegister,
    adminMaterialController.materialRegister
  );

router
  .route("/material/:storeId/:materialId")
  .get(checkValidObjectId, adminMaterialController.getMaterialForm)
  .post(
    checkValidObjectId,
    materialValidator.materialRegister,
    adminMaterialController.editMaterial
  );

//Routes for manipulating visits

router
  .route("/visits")
  .get(adminVisitController.getListVisits)
  .post(adminVisitController.getListVisits);

router
  .route("/visit/delete/:visitId")
  .post(checkValidObjectId, adminVisitController.deleteVisit);

router
  .route("/visit/:visitId/statues")
  .get(checkValidObjectId, adminVisitController.getListStatues);

module.exports = router;
