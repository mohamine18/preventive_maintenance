const { body } = require("express-validator");

exports.visitRegister = [
  body("store").notEmpty().withMessage("Please select a store"),
];
