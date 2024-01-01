const db = require("../services/database.service");
const config = require("../config");
const { ObjectId } = require("mongodb");
const csvService = require("../services/csv.service");

async function createDataset(datasetName, username) {
  return db
    .getCollection(config.COLLECTION_NAMES.DATASET)
    .insertOne({ datasetName: datasetName, username: username });
}

async function insertData(data = [], datasetName, username) {
  let usernameInsertinData = data.map((item) =>
    item.push({ username: username })
  );
  return db.getCollection(datasetName).insertMany(usernameInsertinData);
}

async function searchDatasetByName(datasetName, username) {
  return db
    .getCollection(config.COLLECTION_NAMES.DATASET)
    .findOne(
      { datasetName: datasetName, username: username },
      { projection: { username: false } }
    );
}

async function searchDatasetById(datasetId, username) {
  return db
    .getCollection(config.COLLECTION_NAMES.DATASET)
    .findOne({ _id: new ObjectId(datasetId), username: username });
}

async function listDataset(username) {
  return db
    .getCollection(config.COLLECTION_NAMES.DATASET)
    .find({ username: username }, { projection: { username: false } })
    .toArray();
}

const DATA_FETCH_BATCH_SIZE = 10000;
async function getData(filter, collectionName, username, outStream) {
  let headersWritten = false;
  let result = [];
  let skip = 0;
  do {
    result = await db
      .getCollection(collectionName)
      .find(filter, { username: username })
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

async function getDataPaginated(
  filter,
  datasetName,
  pageNo,
  pageSize,
  username
) {
  return db
    .getCollection(datasetName)
    .find(filter, { username: username })
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize)
    .toArray();
}

async function getDataByCursor(filter, collectionName, username, outStream) {
  let parsedData = await db
    .getCollection(collectionName)
    .find(filter, { username: username })
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
  searchDatasetById,
  listDataset,
  insertData,
  getData,
  getDataPaginated,
};
