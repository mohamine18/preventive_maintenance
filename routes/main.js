const express = require("express");

const homeController = require("../controllers/home");
const visitController = require("../controllers/user/visit");
const statusController = require("../controllers/user/status");

const visitValidator = require("../validators/visit");
const statusValidator = require("../validators/status");

const router = express.Router();

router.route("/").get(homeController.homePage);

router
  .route("/visit/register")
  .get(visitController.getVisitRegistrationPage)
  .post(visitValidator.visitRegister, visitController.visitRegister);

router.route("/visit/:visitId/status").get(visitController.getVisitStatusList);

router.route("/visit/close/:visitId").post(visitController.closeVisit);

router
  .route("/status/:statusId")
  .get(statusController.getStatusForm)
  .post(statusValidator.statusRegister, statusController.editStatus);

router
  .route("/status/:visitId/:materialId/register")
  .get(statusController.getStatusRegistrationPage)
  .post(statusValidator.statusRegister, statusController.statusRegister);

module.exports = router;
