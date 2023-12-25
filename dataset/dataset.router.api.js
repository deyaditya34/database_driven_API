const express = require("express");
const multer = require("multer");
const createDataset = require("./dataset.create.api");
const searchDataset = require("./dataset.search.api");
const listDataset = require("./dataset.list.api");
const insertDataset = require("./dataset.insert.api.js");
const fetchDatasetStream = require("./dataset.fetchStream.api.js");
const fetchDatasetJSON = require("./dataset.fetchJSON.api.js");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/", createDataset);
router.post("/insert", upload.single("csvFile", 1), insertDataset);
router.get("/", searchDataset);
router.get("/list", listDataset);
router.get("/csvstream", fetchDatasetStream);
router.get("/csvjson", fetchDatasetJSON);

module.exports = router;
