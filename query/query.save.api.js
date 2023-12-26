const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { querySave } = require("./query.service");
const { searchDatasetByID } = require("../dataset/dataset.service");

async function controller(req, res) {
  let parsedQueriesArr = queryProcess(req);

  let dataframe = await querySave(parsedQueriesArr);

  res.json({
    message: "queries saved",
    data: dataframe,
  });
}

async function validateParams(req, res, next) {
  const { datasetID } = req.body;

  if (!datasetID) {
    throw new httpError.BadRequest(`Field "datasetID" is missing from req.body`)
  }

  const existingDataset = await searchDatasetByID(datasetID);

  if (!existingDataset) {
    throw new httpError.BadRequest(`Field 'datasetID' - '${datasetID} is invalid.'`)
  }

  next();
}

function queryProcess(req) {
  const queryName = Object.keys(req.body);
  const queryValue = Object.values(req.body);

  let result = {};

  result[queryName[0]] = queryValue[0];
  result[queryName[1]] = queryValue[1];
  result[queryName[2]] = queryValue[2];

  return result;
}

module.exports = buildApiHandler([validateParams, controller]);
