const database = require("../services/database.service");
const config = require("../config");

async function createData(data = []) {
  return database
    .getCollection(config.COLLECTION_NAMES.database)
    .insertMany(data);
}

async function searchData(data) {
  console.log(data);
  return database.getCollection(config.COLLECTION_NAMES.database).find(data);
}

module.exports = { createData, searchData };
