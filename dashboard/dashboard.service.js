const db = require("../services/database.service");
const config = require("../config");
const { ObjectId } = require("mongodb");

async function createDashboard(dashboardName, username) {
  return db
    .getCollection(config.COLLECTION_NAMES.DASHBOARD)
    .insertOne({ dashboardName: dashboardName, username: username });
}

async function insertDataFrameInDashboard(dashboardId, dataframeId = []) {
  return db
    .getCollection(config.COLLECTION_NAMES.DASHBOARD)
    .updateOne(
      { _id: new ObjectId(dashboardId) },
      { $push: { dataframeId: { $each: dataframeId } } }
    );
}

async function findDashboardByName(dashboardName, username) {
  return db
    .getCollection(config.COLLECTION_NAMES.DASHBOARD)
    .findOne({ dashboardName: dashboardName, username: username });
}

async function findDashboardById(dashboardId, username) {
  return db
    .getCollection(config.COLLECTION_NAMES.DASHBOARD)
    .findOne({ _id: new ObjectId(dashboardId), username: username });
}

async function dashboardList(username) {
  return db
    .getCollection(config.COLLECTION_NAMES.DASHBOARD)
    .find({ username })
    .toArray();
}

async function dashboardDataframeLengthChecker(dashboardId, username) {
  let dashboard = await findDashboardById({
    dashboardId: dashboardId,
    username: username,
  });

  let dataFramesInDashboard = dashboard.dataframeId;

  return dataFramesInDashboard;
}

async function removeDataframeFromDashboard(
  dashboardId,
  dataframeId,
  username
) {
  return db
    .getCollection(config.COLLECTION_NAMES.DASHBOARD)
    .updateOne(
      { _id: new ObjectId(dashboardId), username: username },
      { $pull: { dataframeId: dataframeId } }
    );
}

module.exports = {
  createDashboard,
  findDashboardByName,
  findDashboardById,
  dashboardList,
  insertDataFrameInDashboard,
  dashboardDataframeLengthChecker,
  removeDataframeFromDashboard,
};
