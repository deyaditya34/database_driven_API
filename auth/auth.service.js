const httpError = require("http-errors");
const db = require("../services/database.service");
const jwtService = require("../services/jwt.service");
const { COLLECTION_NAMES } = require("../config");
const { buildUser, encryptPassword } = require("./auth.utils");

// Why token is based upon only on the username and not username&password combined??
// What is the difference in use between change Password and Update password(ref. to the expense tracker program). change password api returns a new token and update password does not return any.

async function register(username, password) {
  const existingUser = await retrieveUserByUsername(username);

  if (existingUser) {
    throw new httpError.UnprocessableEntity(
      `Username - '${username}' is already taken.`
    );
  }

  const userDetails = buildUser(username, password);
  await db.getCollection(COLLECTION_NAMES.USERS).insertOne(userDetails);
}

async function login(username, password) {
  const user = await findUserByUSAndPWD(username, password);

  if (!user) {
    throw new httpError.Unauthorized("User/Password combination incorrect.");
  }

  const token = jwtService.createToken({ username });

  return token;
}

async function getUserFromToken(token) {
  const payload = jwtService.decodeToken(token);

  if (!payload) {
    return null;
  }

  const username = payload.username;

  const user = await retrieveUserByUsername(username);

  return user;
}

async function findUsers(criteria) {
  return db.getCollection(COLLECTION_NAMES.USERS).find(criteria).toArray();
}

async function changePassword(username, password, newPassword) {
  const user = await findUserByUSAndPWD(username, password);

  if (!user) {
    throw new httpError.Unauthorized("Username/Password combo incorrect");
  }

  let updatedUser = buildUser(username, newPassword);

  await db
    .getCollection(COLLECTION_NAMES.USERS)
    .updateOne({ updatedUser }, { $set: { password: updatedUser.password } });

  const token = jwtService.createToken({ username });

  return token;
}

async function retrieveUserByUsername(username) {
  return db
    .getCollection(COLLECTION_NAMES.USERS)
    .findOne({ username }, { projection: { _id: false, password: false } });
}

async function listUser() {
  return db
    .getCollection(COLLECTION_NAMES.USERS)
    .find({ role: { $ne: "ADMIN" } });
}

async function findUserByUSAndPWD(username, password) {
  return db.getCollection(COLLECTION_NAMES.USERS).findOne(
    {
      username,
      password: encryptPassword(password),
    },
    { projection: { _id: false, password: false } }
  );
}

module.exports = {
  register,
  login,
  getUserFromToken,
  findUsers,
  changePassword,
  retrieveUserByUsername,
  listUser,
  findUserByUSAndPWD,
};
