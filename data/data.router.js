const express = require("express");

const router = express.Router();
const insertData = require("./insert_data_api");
const searchData = require("./search_data_api");


router.post("/", insertData);
router.get("/", searchData);



module.exports = router;