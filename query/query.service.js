const db = require("../services/database.service");
const config = require("../config");
const { ObjectId } = require("mongodb");

async function querySave(query) {
  return db.getCollection(config.COLLECTION_NAMES.QUERY_SAVE).insertOne(query);
}

async function queryFind(dataFrameId) {
  return db
    .getCollection(config.COLLECTION_NAMES.QUERY_SAVE)
    .findOne({ _id: new ObjectId(dataFrameId) });
}

async function queryList(datasetId) {
  return db
    .getCollection(config.COLLECTION_NAMES.QUERY_SAVE)
    .find({ datasetID: datasetId })
    .toArray();
}

module.exports = { querySave, queryFind, queryList };
