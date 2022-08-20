const express = require("express");

const router = express.Router();

const authValidator = require("../validators/authentication");

const authController = require("../controllers/authentication");

router
  .route("/login")
  .get(authController.redirectLoggedIn, authController.getLoginPage)
  .post(authValidator.login, authController.login);

router.route("/logout").post(authController.logout);
module.exports = router;
