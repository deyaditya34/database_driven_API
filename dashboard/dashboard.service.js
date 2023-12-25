const db = require("../services/database.service");
const config = require("../config");

async function createDashboard(dashboardName) {
  return db
    .getCollection(config.COLLECTION_NAMES.DASHBOARD)
    .insertOne({dashboardName});
}


module.exports = {createDashboard}
