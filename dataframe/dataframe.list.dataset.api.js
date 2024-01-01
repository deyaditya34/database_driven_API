const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { searchDatasetByID } = require("../dataset/dataset.service");
const { listDataframeByDataset } = require("./dataframe.service");
const userResolver = require("../middlewares/user.Resolver");
const paramsValidator = require("../middlewares/params.validator");

async function controller(req, res) {
  const { datasetId } = req.query;
  const { user } = req.body;

  const datasetID = await validateDatasetId(datasetId, user.username);
  const datasetIDStringify = datasetID.toString();

  const queries = await listDataframeByDataset(datasetIDStringify, user.username);

  if (queries.length === 0) {
    res.json({
      message: `no saved queries for the datasetId ${datasetIDStringify}`,
    });
  } else {
    res.json({
      message: "queries found",
      data: queries,
    });
  }
}

async function validateDatasetId(datasetId, username) {
  const existingDataset = await searchDatasetByID(datasetId, username);

  if (!existingDataset) {
    throw new httpError.BadRequest(`datbaseId ${datasetId} is invalid.`);
  }

  return existingDataset._id;
}

const missingParamsValidator = paramsValidator.createParamValidator(
  ["datasetId"],
  paramsValidator.PARAM_KEY.QUERY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  controller,
]);
