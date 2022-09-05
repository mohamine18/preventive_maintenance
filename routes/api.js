const express = require("express");

const router = express.Router();

const adminApiController = require("../controllers/api");

// to get list of materials of a store
router.route("/materials").get(adminApiController.getMaterialsList);

module.exports = router;
