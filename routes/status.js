const express = require("express");

const statusController = require("../controllers/user/status");

const statusValidator = require("../validators/status");
const { checkValidObjectId } = require("../controllers/authorization");

const router = express.Router();

router
  .route("/:statusId")
  .get(checkValidObjectId, statusController.getStatusForm)
  .post(
    checkValidObjectId,
    statusValidator.statusRegister,
    statusController.editStatus
  );

router
  .route("/:visitId/:materialId/register")
  .get(checkValidObjectId, statusController.getStatusRegistrationPage)
  .post(
    checkValidObjectId,
    statusValidator.statusRegister,
    statusController.statusRegister
  );

module.exports = router;
