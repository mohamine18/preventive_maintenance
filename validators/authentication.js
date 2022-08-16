const { body } = require("express-validator");

exports.login = [body("email").isEmail().withMessage("Invalide email address")];
