const express = require("express");

const router = express.Router();

const saveDataframe = require("./query.save.api");
const listDataframe = require("./query.list.api");
const findDataframe = require("./query.find.api")


router.post("/", saveDataframe);
router.get("/", findDataframe);
router.get("/list", listDataframe);

module.exports = router;
