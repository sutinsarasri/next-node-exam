var express = require("express");
const router = express.Router();
const jwt = require("../utils/jwt");
const User = require("../models/user");
const userController = require("../controllers/userController");

/*  ปิด jwt verify ไว้ก่อนติดปัญหา set cookie ไม่ได้  */
router.get("/create", userController.usersCreaet);
router.get("/", jwt.verify, userController.usersAll);
// router.get("/", userController.usersAll);
router.get("/:id", jwt.verify, userController.getUser);
// router.get("/:id", userController.getUser);
router.put("/edit", jwt.verify, userController.editUser);
// router.put("/edit", userController.editUser);
router.delete("/delete/:id", jwt.verify, userController.deleteUser);
// router.delete("/delete/:id", userController.deleteUser);

module.exports = router;
