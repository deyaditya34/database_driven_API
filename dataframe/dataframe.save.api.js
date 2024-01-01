const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { searchDatasetByID } = require("../dataset/dataset.service");
const { insertDataframe, findDataframeByName } = require("./dataframe.service");
const userResolver = require("../middlewares/user.Resolver");
const paramsValidator = require("../middlewares/params.validator");

async function controller(req, res) {
  const { parsedDataframe, user } = req.body;

  let dataframe = await insertDataframe({
    ...parsedDataframe,
    username: user.username,
  });

  res.json({
    message: "dataframe Saved",
    data: dataframe,
  });
}

async function validateAndProcessDataframe(req, res, next) {
  const { dataframeName, filters, datasetId, user } = req.body;

  if (typeof dataframeName !== "string") {
    throw new httpError.BadRequest(
      `Field dataframeName - '${dataframeName}' should be 'string' type.`
    );
  }
  
  const EXISTING_DATAFRAME = await findDataframeByName(
    dataframeName,
    user.username
  );

  if (EXISTING_DATAFRAME) {
    throw new httpError.BadRequest(
      `Field dataframeName - '${dataframeName}' already exists.`
    );
  }

  if (filters > 0 || typeof filters !== "object") {
    throw new httpError.BadRequest(
      `Field filters - '${filters}' should be object type.`
    );
  }

  const existingDataset = await searchDatasetByID(datasetId);

  if (!existingDataset) {
    throw new httpError.BadRequest(
      `Field 'datasetID' - '${datasetId} is invalid.'`
    );
  }

  let parsedDataframe = {
    dataframeName,
    filters,
    datasetId
  }

  Reflect.set(req.body, "parsedDataframe", parsedDataframe)

  next();
}

const missingParamsValidator = paramsValidator.createParamValidator(
  ["dataframeName", "filters", "datasetId"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateAndProcessDataframe,
  controller,
]);
