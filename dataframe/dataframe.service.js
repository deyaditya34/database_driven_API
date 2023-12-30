const db = require("../services/database.service");
const config = require("../config");
const { ObjectId } = require("mongodb");

async function insertDataframe(query) {
  return db.getCollection(config.COLLECTION_NAMES.DATAFRAME).insertOne(query);
}

async function findDataframe(dataFrameId) {
  return db
    .getCollection(config.COLLECTION_NAMES.DATAFRAME)
    .findOne({ _id: new ObjectId(dataFrameId) });
}

async function listDataframe(datasetId) {
  return db
    .getCollection(config.COLLECTION_NAMES.DATAFRAME)
    .find({ datasetID: datasetId })
    .toArray();
}

module.exports = { insertDataframe, findDataframe, listDataframe };
