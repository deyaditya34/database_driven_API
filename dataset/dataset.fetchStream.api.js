const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { searchDatasetById, getData } = require("./dataset.service");
const { findDataframeById } = require("../dataframe/dataframe.service");
const userResolver = require("../middlewares/user.Resolver");
const paramsValidator = require("../middlewares/params.validator");

async function controller(req, res) {
  const { dataframeId } = req.query;
  const {user} = req.body;

  const dataFrame = await validateDataframeId(dataframeId, user.username);

  const filter = dataFrame.filters;

  const datasetName = await findDatasetName(dataFrame.datasetId, user.username);

  res.setHeader("Content-disposition", "attachment; filename=outputFile.csv");
  res.setHeader("Content-type", "text/csv");
  
  await getData(filter, datasetName, user.username, res);

  res.end();
}

async function validateDataframeId(dataframeId, username) {
  const existingDataframe = await findDataframeById(dataframeId, username);

  if (!existingDataframe) {
    throw new httpError.BadRequest(`Field ${dataframeId} is invalid.`);
  }

  return existingDataframe;
}

async function findDatasetName(datasetId, username) {
  const dataset = await searchDatasetById(datasetId, username);

  return dataset.datasetName;
}

const missingParamsValidator = paramsValidator.createParamValidator(
  ["dataframeId"],
  paramsValidator.PARAM_KEY.QUERY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  controller,
]);
