const db = require("../services/database.service");
const config = require("../config");

async function createData(data = []) {
  return db.getCollection(config.COLLECTION_NAMES.database).insertMany(data);
}

async function searchData(data) {
  console.log(data);
  return db
    .getCollection(config.COLLECTION_NAMES.database)
    .find(data)
    .toArray();
}

module.exports = { createData, searchData };
