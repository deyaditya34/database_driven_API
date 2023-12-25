const db = require("../services/database.service");
const config = require("../config");
const { ObjectId } = require("mongodb");

async function createDataset(datasetName) {
  return db
    .getCollection(config.COLLECTION_NAMES.DATASET)
    .insertOne(datasetName);
}

async function searchDatasetByName(datasetName) {
  return db.getCollection(config.COLLECTION_NAMES.DATASET).findOne(datasetName);
}

async function searchDatasetByID(datasetId) {
  return db.getCollection(config.COLLECTION_NAMES.DATASET).findOne({_id: new ObjectId(datasetId)})
}

async function listDataset() {
  return db.getCollection(config.COLLECTION_NAMES.DATASET).find().toArray();
}

module.exports = {
  createDataset,
  searchDatasetByName,
  searchDatasetByID,
  listDataset,
};

