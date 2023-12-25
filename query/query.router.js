const express = require("express");

const router = express.Router();

const querySave = require("./query.save.api");
const queryList = require("./query.list.api");
const queryFind = require("./query.find.api")


router.post("/", querySave);
router.get("/", queryFind);
router.get("/list", queryList);

module.exports = router;
