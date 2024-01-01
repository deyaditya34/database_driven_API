const express = require("express");

const registerUser = require("./auth.register.api");
const loginUser = require("./auth.login.api");
const queryUsers = require("./auth.queryUsersByUsername.api");
const changePasswordUser = require("./auth.changePassword.api")

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", queryUsers);
router.post("/changePassword", changePasswordUser);


module.exports = router;

