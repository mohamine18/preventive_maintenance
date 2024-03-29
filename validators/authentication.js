const { body } = require("express-validator");

exports.login = [body("email").isEmail().withMessage("Invalid email address")];

exports.userRegister = [
  body("name").notEmpty().trim().withMessage("Please enter a valid name"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("role").notEmpty().withMessage("Please select a role and a function"),
  body("func").notEmpty().withMessage("Please select a role and a function"),
  body("store").notEmpty().withMessage("Please select a store"),
  body("password")
    .isLength({ min: 8 })
    .withMessage(
      "Please enter a valid password with minimum of 8 letters and numbers"
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Confirm password is not matching the password");
    }
    return true;
  }),
];

exports.userEdit = [
  body("name").notEmpty().trim().withMessage("Please enter a valid name"),
  body("role").notEmpty().withMessage("Please select a role and a function"),
  body("func").notEmpty().withMessage("Please select a role and a function"),
  body("store").notEmpty().withMessage("Please select a store"),
];
