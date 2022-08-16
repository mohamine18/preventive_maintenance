const express = require("express");

const router = express.Router();

const authValidator = require("../validators/authentication");

const authMiddleware = require("../controllers/authentication");

router
  .route("/login")
  .get(authMiddleware.getLoginPage)
  .post(authValidator.login, authMiddleware.login);

module.exports = router;
