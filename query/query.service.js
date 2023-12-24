const db = require("../services/database.service");
const config = require("../config");

async function querySave(arr) {
  return db.getCollection(config.COLLECTION_NAMES.QUERY_SAVE).insertMany(arr);
}

async function queryFind(query) {
  return db.getCollection(config.COLLECTION_NAMES.QUERY_SAVE).findOne(query);
}

module.exports = { querySave, queryFind };
