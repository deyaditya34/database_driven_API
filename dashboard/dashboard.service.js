const db = require("../services/database.service");
const config = require("../config");
const { ObjectId } = require("mongodb");

async function createDashboard(dashboardName) {
  return db
    .getCollection(config.COLLECTION_NAMES.DASHBOARD)
    .insertOne({ dashboardName });
}

async function findDashboardByName(dashboardName) {
  return db
    .getCollection(config.COLLECTION_NAMES.DASHBOARD)
    .findOne({ dashboardName: dashboardName });
}

async function findDashboardById(dashboardId) {
  return db
    .getCollection(config.COLLECTION_NAMES.DASHBOARD)
    .findOne({ _id: new ObjectId(dashboardId) });
}

async function dashboardList() {
  return db.getCollection(config.COLLECTION_NAMES.DASHBOARD).find().toArray();
}

module.exports = {
  createDashboard,
  findDashboardByName,
  findDashboardById,
  dashboardList,
};
