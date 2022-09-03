const express = require("express");

const visitController = require("../controllers/user/visit");
const { checkValidObjectId } = require("../controllers/authorization");

const visitValidator = require("../validators/visit");

const router = express.Router();

router
  .route("/register")
  .get(visitController.getVisitRegistrationPage)
  .post(visitValidator.visitRegister, visitController.visitRegister);

router
  .route("/:visitId/statues")
  .get(checkValidObjectId, visitController.getVisitStatusList);

router
  .route("/close/:visitId")
  .post(checkValidObjectId, visitController.closeVisit);

module.exports = router;
