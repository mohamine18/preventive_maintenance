const express = require("express");

const router = express.Router();

const authValidator = require("../validators/authentication");

const authController = require("../controllers/authentication");

router
  .route("/login")
  .get(authController.getLoginPage)
  .post(authValidator.login, authController.login);

module.exports = router;
