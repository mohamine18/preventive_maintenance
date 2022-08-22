const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

const authzController = require("../controllers/authorization");

const authValidator = require("../validators/authentication");

router.use((req, res, next) => {
  if (req.user.role !== "admin") {
    return res.redirect("/");
  }
  next();
});

router
  .route("/register")
  .get(authzController.hasPermission, adminController.getRegistrationPage)
  .post(
    authzController.hasPermission,
    authValidator.register,
    adminController.register
  );
router
  .route("/users")
  .get(authzController.hasPermission, adminController.getListUsers);

router
  .route("/user/:userId")
  .get(authzController.hasPermission, adminController.getUserForm)
  .post(
    authzController.hasPermission,
    authValidator.editUser,
    adminController.editUser
  );

router
  .route("/user/delete/:userId")
  .post(authzController.hasPermission, adminController.deleteUser);

module.exports = router;
