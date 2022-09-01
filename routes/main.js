const express = require("express");

const homeController = require("../controllers/home");

const router = express.Router();

router.route("/").get(homeController.homePage);

module.exports = router;
