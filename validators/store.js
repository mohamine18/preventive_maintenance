const { body } = require("express-validator");

exports.storeRegister = [
  body("name").notEmpty().trim().withMessage("Please enter a name"),
  body("address").notEmpty().trim().withMessage("Please enter an address"),
  body("province").notEmpty().withMessage("Please select a province"),
];
