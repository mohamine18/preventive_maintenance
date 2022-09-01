const express = require("express");

const statusController = require("../controllers/user/status");

const statusValidator = require("../validators/status");

const router = express.Router();

router
  .route("/:statusId")
  .get(statusController.getStatusForm)
  .post(statusValidator.statusRegister, statusController.editStatus);

router
  .route("/:visitId/:materialId/register")
  .get(statusController.getStatusRegistrationPage)
  .post(statusValidator.statusRegister, statusController.statusRegister);

module.exports = router;
