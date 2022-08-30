const { body } = require("express-validator");

exports.statusRegister = [
  body("clean").notEmpty().withMessage("Please select a value for Cleanliness"),
  body("physicalState")
    .notEmpty()
    .withMessage("Please select a value for Physical State"),
  body("inverter")
    .notEmpty()
    .withMessage("Please select a value for Inverter Autonomy (Onduleur)"),
  body("antivirus")
    .notEmpty()
    .withMessage("Please select a value for Antivirus Status"),
  body("diskStatus")
    .notEmpty()
    .withMessage("Please select a value for Disk Status"),
  body("osState")
    .notEmpty()
    .withMessage("Please select a value for Operation System State"),
  body("networkState")
    .notEmpty()
    .withMessage("Please select a value for Network State"),
  body("windowsLicense")
    .notEmpty()
    .withMessage("Please select a value for Windows License"),
  body("officeLicense")
    .notEmpty()
    .withMessage("Please select a value for Office License"),
];
