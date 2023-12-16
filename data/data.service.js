const db = require("../services/database.service");
const config = require("../config");

async function createData(data = [], collectionName = "database") {
  return db.getCollection(collectionName).insertMany(data);
}

async function searchData(data) {
  console.log(data);
  return db
    .getCollection(collectionName)
    .find(data)
    .toArray();
}

module.exports = { createData, searchData };
