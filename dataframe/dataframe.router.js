const express = require("express");

const router = express.Router();

const insertDataframe = require("./dataframe.save.api");
const findDataframe = require("./dataframe.find.api");
const listDataframe = require("./dataframe.list.api");
const listDataframeByDataset = require("./dataframe.list.dataset.api");

router.post("/", insertDataframe);
router.get("/", findDataframe);
router.get("/list", listDataframe);
router.get("/list/dataset", listDataframeByDataset);

module.exports = router;
