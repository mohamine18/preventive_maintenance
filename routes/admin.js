const express = require("express");

const router = express.Router();

const adminUserController = require("../controllers/admin/user");
const adminStoreController = require("../controllers/admin/store");

const authzController = require("../controllers/authorization");

const authValidator = require("../validators/authentication");
const storeValidator = require("../validators/store");

router.use((req, res, next) => {
  if (req.user.role !== "admin") {
    return res.redirect("/");
  }
  next();
});

// Routes of manipulating Users or Accounts
router
  .route("/user/register")
  .get(
    authzController.hasPermission,
    adminUserController.getUserRegistrationPage
  )
  .post(
    authzController.hasPermission,
    authValidator.userRegister,
    adminUserController.userRegister
  );

router
  .route("/users")
  .get(authzController.hasPermission, adminUserController.getListUsers);

router
  .route("/user/:userId")
  .get(authzController.hasPermission, adminUserController.getUserForm)
  .post(
    authzController.hasPermission,
    authValidator.userEdit,
    adminUserController.editUser
  );

router
  .route("/user/delete/:userId")
  .post(authzController.hasPermission, adminUserController.deleteUser);

// Routes of manipulating Stores
router
  .route("/store/register")
  .get(
    authzController.hasPermission,
    adminStoreController.getStoreRegistrationPage
  )
  .post(
    authzController.hasPermission,
    storeValidator.storeRegister,
    adminStoreController.storeRegister
  );

router
  .route("/stores")
  .get(authzController.hasPermission, adminStoreController.getListStores);

router
  .route("/store/:storeId")
  .get(authzController.hasPermission, adminStoreController.getStoreForm)
  .post(
    authzController.hasPermission,
    authValidator.userEdit,
    adminUserController.editUser
  );

router
  .route("/store/delete/:storeId")
  .post(authzController.hasPermission, adminStoreController.deleteStore);

module.exports = router;
