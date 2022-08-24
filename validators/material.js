const { body } = require("express-validator");

exports.materialRegister = [
  body("name").notEmpty().trim().withMessage("Please enter the material name"),
  body("inventoryCode")
    .notEmpty()
    .trim()
    .withMessage("Please enter the inventory code"),
  body("acquisitionDate")
    .notEmpty()
    .withMessage("Please select the acquisition date"),
  body("category")
    .notEmpty()
    .withMessage("Please select the category of the material"),
];
