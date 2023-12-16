const express = require("express");
const multer = require("multer");
const upload = multer({dest: "uploads/"})


const router = express.Router();
const insertData = require("./insert_data_api");
const searchData = require("./search_data_api");


router.post("/", upload.array("csvFile", 3), insertData);
router.get("/", searchData);



module.exports = router;