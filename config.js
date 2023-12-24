const APP_PORT = 3090;
const MONGO_DB_URI = "mongodb://127.0.0.1:27017";
const DB_NAME = "database_driven_API"

const COLLECTION_NAMES = {
  QUERY_SAVE : "querySavedColl"
}

module.exports = {
  APP_PORT,
  MONGO_DB_URI,
  DB_NAME,
  COLLECTION_NAMES
}