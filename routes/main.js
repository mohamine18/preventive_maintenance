const express = require("express");

const homeController = require("../controllers/home");
const visitController = require("../controllers/user/visit");

const visitValidator = require("../validators/visit");

const router = express.Router();

router.route("/").get(homeController.homePage);

router
  .route("/visit/register")
  .get(visitController.getVisitRegistrationPage)
  .post(visitValidator.visitRegister, visitController.visitRegister);

module.exports = router;
