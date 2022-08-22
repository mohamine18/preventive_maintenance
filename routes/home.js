const express = require("express");

const homeController = require("../controllers/home");
const authzController = require("../controllers/authorization");

const router = express.Router();

router.route("/").get(authzController.hasPermission, homeController.homePage);

module.exports = router;
