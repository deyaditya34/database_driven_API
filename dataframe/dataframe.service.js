const db = require("../services/database.service");
const config = require("../config");
const { ObjectId } = require("mongodb");

async function insertDataframe(query) {
  return db.getCollection(config.COLLECTION_NAMES.DATAFRAME).insertOne(query);
}

async function findDataframeById(dataFrameId, username) {
  return db
    .getCollection(config.COLLECTION_NAMES.DATAFRAME)
    .findOne(
      { _id: new ObjectId(dataFrameId), username: username },
      { projection: { username: false } }
    );
}

async function findDataframeByName(dataframeName, username) {
  return db
    .getCollection(config.COLLECTION_NAMES.DATAFRAME)
    .findOne({ dataframeName: dataframeName, username: username });
}

async function listDataframeByDataset(datasetId, username) {
  return db
    .getCollection(config.COLLECTION_NAMES.DATAFRAME)
    .find(
      { datasetId: datasetId, username: username },
      { projection: { username: false } }
    )
    .toArray();
}

async function listDataframe(username) {
  return db
    .getCollection(config.COLLECTION_NAMES.DATAFRAME)
    .find({ username: username }, { projection: { username: false } })
    .toArray();
}

module.exports = {
  insertDataframe,
  findDataframeById,
  findDataframeByName,
  listDataframe,
  listDataframeByDataset,
};
