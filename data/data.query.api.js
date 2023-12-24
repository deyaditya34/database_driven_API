const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { queryFind } = require("../query/query.service");
const { getDataByCursor } = require("./data.service");

async function controller(req, res) {
  const parsedQueries = await findQueries(req);

  const filter = parseFilters(parsedQueries)
  const collectionName = parseCollectionName(parsedQueries);

  await getDataByCursor(filter, collectionName, res);
  
  res.end()
}

async function findQueries(req) {
  const queryName = req.body.queryName;

  if (queryName) {
    let result = await queryFind({ queryName });

    return result;
  } else {
    throw new httpError.BadRequest(
      `Field 'queryName' is needed for this API call.`
    );
  }
}

function parseFilters(parsedQueries) {
  const queryValues = parsedQueries["queryValue"];

  const queryKeys = Object.keys(queryValues);

  let filters = {};
  queryKeys.forEach((key) => {
    if (key !== "collectionName") {
      filters[key] = queryValues[key];
    }
  });

  return filters;
}

function parseCollectionName(parsedQueries) {
  const queryValues = parsedQueries["queryValue"];
  
  let collectionName;
  if (!queryValues["collectionName"]) {
    collectionName = "n_a_h_p";
  } else {
    collectionName = queryValues["collectionName"];
  }

  return collectionName;
}

module.exports = buildApiHandler([controller]);
