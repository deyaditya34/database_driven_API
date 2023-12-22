const db = require("../services/database.service");

async function createData(data = [], collectionName = "database") {
  return db.getCollection(collectionName).insertMany(data);
}

async function searchData(searchCriteria, collectionName) {
  return db.getCollection(collectionName).find(searchCriteria).toArray();
}

let filesFound = 0;

async function downloadData(searchCriteria, collectionName, cb1, cb2) {
  let result = await db
    .getCollection(collectionName)
    .find(searchCriteria)
    .sort({ ID: 1 })
    .limit(50000)
    .toArray();

  filesFound += result.length;
  console.log(`${filesFound} files found`);

  if (result) {
    await cb1(result);
    let lastItemInFind = result[result.length - 1];
    searchCriteria["ID"] = { $gt: lastItemInFind["ID"] };
    console.log(searchCriteria);
  } else {
    await cb2(result);
  }
  return;
}

module.exports = { createData, searchData, downloadData };
