const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");
const authController = require("../controllers/authentication");

const authValidator = require("../validators/authentication");

router
  .route("/register")
  .get(authController.hasPermission, adminController.getRegistrationPage)
  .post(
    authController.hasPermission,
    authValidator.register,
    adminController.register
  );

module.exports = router;
