const express = require("express");

const visitController = require("../controllers/user/visit");

const visitValidator = require("../validators/visit");

const router = express.Router();

router
  .route("/register")
  .get(visitController.getVisitRegistrationPage)
  .post(visitValidator.visitRegister, visitController.visitRegister);

router.route("/:visitId/status").get(visitController.getVisitStatusList);

router.route("/close/:visitId").post(visitController.closeVisit);

module.exports = router;
