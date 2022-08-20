const express = require("express");

const homeController = require("../controllers/home");
const authController = require("../controllers/authentication");

const router = express.Router();

router
  .route("/")
  .get(
    authController.isLoggedIn,
    authController.hasPermission,
    homeController.homePage
  );

module.exports = router;
