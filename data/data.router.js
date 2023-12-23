const express = require("express");
const multer = require("multer");
const upload = multer({dest: "uploads/"})


const router = express.Router();
const insertData = require("./insert.data.api");
const searchData = require("./search.data.api");
const downloadData = require("./fetch.data.api")

router.post("/", upload.single("csvFile", 1), insertData);
router.get("/", searchData);
router.get("/csv", downloadData);


module.exports = router;
