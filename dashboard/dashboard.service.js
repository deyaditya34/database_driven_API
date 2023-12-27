const db = require("../services/database.service");
const config = require("../config");
const { ObjectId } = require("mongodb");

async function createDashboard(dashboardName) {
  return db
    .getCollection(config.COLLECTION_NAMES.DASHBOARD)
    .insertOne({ dashboardName });
}

async function insertDataFrameInDashboard(dashboardId, dataframeId = []) {
  return db
    .getCollection(config.COLLECTION_NAMES.DASHBOARD)
    .updateOne(
      { _id: new ObjectId(dashboardId) },
      { $set: dataframeId }
    );
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

async function dashboardDataframeLengthChecker(dashboardId) {
  let dashboard = await findDashboardById(dashboardId);

  let dataFramesInDashboard = dashboard.dataframeId;

  return dataFramesInDashboard;
}

async function removeDataframeFromDashboard(dashboardId, dataframeId) {
  return db.getCollection(config.COLLECTION_NAMES.DASHBOARD).updateOne(
    {_id: new ObjectId(dashboardId)},
    {$pull : {dataframeId : dataframeId}}
  )
}

module.exports = {
  createDashboard,
  findDashboardByName,
  findDashboardById,
  dashboardList,
  insertDataFrameInDashboard,
  dashboardDataframeLengthChecker,
  removeDataframeFromDashboard
};
