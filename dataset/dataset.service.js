const db = require("../services/database.service");
const config = require("../config");
const { ObjectId } = require("mongodb");
const csvService = require("../services/csv.service")

async function createDataset(datasetName) {
  return db
    .getCollection(config.COLLECTION_NAMES.DATASET)
    .insertOne(datasetName);
}

async function insertData(data = [], datasetName) {
  return db.getCollection(datasetName).insertMany(data);
}

async function searchDatasetByName(datasetName) {
  return db.getCollection(config.COLLECTION_NAMES.DATASET).findOne(datasetName);
}

async function searchDatasetByID(datasetId, username) {
  return db.getCollection(config.COLLECTION_NAMES.DATASET).findOne({_id: new ObjectId(datasetId), username: username})
}

async function listDataset() {
  return db.getCollection(config.COLLECTION_NAMES.DATASET).find().toArray();
}

const DATA_FETCH_BATCH_SIZE = 10000;
async function getData(filter, collectionName, outStream) {
  let headersWritten = false;
  let result = [];
  let skip = 0;
  do {
    result = await db
      .getCollection(collectionName)
      .find(filter)
      .skip(skip)
      .limit(DATA_FETCH_BATCH_SIZE)
      .toArray();

    if (result.length === 0) {
      return;
    }

    if (!headersWritten) {
      let header = Object.keys(result[0]);
      csvService.writeCsvHeader(header, outStream);

      headersWritten = true;
    }

    csvService.writeCsvItems(result, outStream);

    skip += DATA_FETCH_BATCH_SIZE;
  } while (result.length > 0);
}

async function getDataPaginated(filter, datasetName, pageNo, pageSize) {
  return db
    .getCollection(datasetName)
    .find(filter)
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize)
    .toArray();
}

async function getDataByCursor(filter, collectionName, outStream) {
  let parsedData = await db
    .getCollection(collectionName)
    .find(filter)
    .limit(10);

  let headersWritten = false;

  parsedData.forEach(async (item) => {
    if (!headersWritten) {
      let header = Object.keys(item);
      csvService.writeCsvHeader(header, outStream);

      headersWritten = true;
    }

    csvService.writeCsvItemsForCursor(item, outStream);
  });
}

module.exports = {
  createDataset,
  searchDatasetByName,
  searchDatasetByID,
  listDataset,
  insertData,
  getData,
  getDataPaginated
};

