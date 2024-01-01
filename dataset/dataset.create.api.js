const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { createDataset, searchDatasetByName } = require("./dataset.service");
const userResolver = require("../middlewares/user.Resolver");
const paramsValidator = require("../middlewares/params.validator");

async function controller(req, res) {
  const { datasetName, user } = req.body;

  let result = await createDataset(datasetName, user.username);

  res.json({
    message: "dataset created",
    data: {
      id: result.insertedId,
    },
  });
}

async function validateParams(req, res, next) {
  const { datasetName, user } = req.body;

  if (!datasetName) {
    throw new httpError.BadRequest(
      'the key should be named as "datasetName" in order to create dataset in the DB.'
    );
  }

  let existingDatasetName = await searchDatasetByName(datasetName, user.username);

  if (existingDatasetName) {
    throw new httpError.BadRequest(
      `datasetName ${datasetName} already exists.`
    );
  }

  if (typeof datasetName !== "string") {
    throw new httpError.BadRequest(
      `datasetName ${datasetName} should be of string type.`
    );
  }

  next();
}

const missingParamsValidator = paramsValidator.createParamValidator(
  ["datasetName"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateParams,
  controller,
]);
