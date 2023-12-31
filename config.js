const APP_PORT = 3090;
const MONGO_DB_URI = "mongodb://127.0.0.1:27017";
const DB_NAME = "database_driven_API";

const COLLECTION_NAMES = {
  USERS: "users",
  DATAFRAME: "dataframe",
  DATASET: "dataset",
  DASHBOARD: "dashboard",
};

const JWT_SECRET = "Bokakhat@123";

const AUTH_TOKEN_HEADER_FIELD = "token";

const PASSWORD_SALT = "Bokakhat@123";

module.exports = {
  APP_PORT,
  MONGO_DB_URI,
  DB_NAME,
  COLLECTION_NAMES,
  JWT_SECRET,
  AUTH_TOKEN_HEADER_FIELD,
  PASSWORD_SALT
};
