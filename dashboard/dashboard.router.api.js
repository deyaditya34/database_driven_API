const express = require("express");
const router = express.Router();

const createDashboard = require("./dashboard.create.api");
const dashboardFind = require("./dashboard.find.api");
const dashboardList = require("./dashboard.list.api");
const dataFrameInDashboard = require("./dashboard.remove.api");
const insertDataFrameInDashboard = require("./dashboard.insert.api");

router.post("/", createDashboard);
router.get("/", dashboardFind);
router.get("/list", dashboardList);
router.delete("/", dataFrameInDashboard);
router.post("/dataFrame", insertDataFrameInDashboard);

module.exports = router;
