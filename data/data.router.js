const express = require("express");
const multer = require("multer");
const upload = multer({dest: "uploads/"})


const router = express.Router();
// const insertData = require("./insert.data.api");
const searchData = require("./search.data.api");
// const fetchData = require("./data.fetch.api")
const queryData = require("./data.query.api")

// router.post("/", upload.single("csvFile", 1), insertData);
router.get("/", searchData);
// router.get("/csv", fetchData);
router.get("/csvQuery", queryData)


module.exports = router;
