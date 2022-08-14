const express = require("express");

const router = express.Router();

const authMiddleware = require("../controllers/authentication");

router
  .route("/login")
  .get(authMiddleware.getLoginPage)
  .post(authMiddleware.login);

module.exports = router;
