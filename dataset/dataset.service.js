const db = require("../services/database.service");
const config = require("../config");

async function createDataset(datasetName) {
  return db
    .getCollection(config.COLLECTION_NAMES.DATASET)
    .insertOne(datasetName);
}

async function searchDataset(filter) {
  return db.getCollection(config.COLLECTION_NAMES.DATASET).findOne(filter);
}

async function listDataset() {
  return db.getCollection(config.COLLECTION_NAMES.DATASET).find().toArray();
}

module.exports = { createDataset, searchDataset, listDataset };
