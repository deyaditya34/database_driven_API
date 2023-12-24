const express = require("express");

const router = express.Router();

const querySave = require("../query/query.save.api");

router.post("/", querySave);


module.exports = router;
