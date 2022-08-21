const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");
const authController = require("../controllers/authentication");

const authValidator = require("../validators/authentication");

router.use((req, res, next) => {
  if (req.user.role !== "admin") {
    return res.redirect("/");
  }
  next();
});

router
  .route("/register")
  .get(authController.hasPermission, adminController.getRegistrationPage)
  .post(
    authController.hasPermission,
    authValidator.register,
    adminController.register
  );
router
  .route("/users")
  .get(authController.hasPermission, adminController.getListUsers);

router
  .route("/user/:userId")
  .get(authController.hasPermission, adminController.getUserForm)
  .post(authController.hasPermission, adminController.editUser);

router
  .route("/user/delete/:userId")
  .post(authController.hasPermission, adminController.deleteUser);

module.exports = router;
