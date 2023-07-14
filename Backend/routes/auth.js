const express = require("express");
const router = express.Router();
const jwt = require("../utils/jwt");
const loginController = require("../controllers/loginController");
const registerController = require("../controllers/registerController");
router.post("/login", loginController.login);
router.post("/register", jwt.verify, registerController.postRegister);

module.exports = router;
