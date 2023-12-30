const express = require("express");

const router = express.Router();

const insertDataframe = require("./dataframe.save.api");
const listDataframe = require("./dataframe.list.api");
const findDataframe = require("./dataframe.find.api")


router.post("/", insertDataframe);
router.get("/", findDataframe);
router.get("/list", listDataframe);

module.exports = router;
