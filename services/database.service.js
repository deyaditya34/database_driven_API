const mongodb = require("mongodb");
const config = require("../config");

const client = new mongodb.MongoClient(config.MONGO_DB_URI);

let database = null;

async function initialise() {
  await client.connect();

  database = client.db(config.DB_NAME);
}


function getCollection(collectionName) {
  return database.collection(collectionName);
}

module.exports = {
  initialise,
  getCollection,
}
