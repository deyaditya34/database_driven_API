const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { findDataframeById } = require("../dataframe/dataframe.service");
const { getDataPaginated, searchDatasetById } = require("./dataset.service");
const userResolver = require("../middlewares/user.Resolver");
const paramsValidator = require("../middlewares/params.validator");


async function controller(req, res) {
  const { dataframeId, pageNo, pageSize } = req.query;
  const { user } = req.body;
  const dataframe = await validateDataframeId(dataframeId, user.username);

  const filter = dataframe.filters;

  const datasetName = await findDatasetName(dataframe.datasetId, user.username);

  let result = await getDataPaginated(
    filter,
    datasetName,
    pageNo,
    pageSize,
    user.username
  );

  if (result.length === 0) {
    res.json({
      message: "No data found for the dataframeId",
    });
  } else {
    res.json({
      message: "data found",
      data: result,
    });
  }
}

async function validateDataframeId(dataframeId, username) {
  if (!dataframeId) {
    throw new httpError.BadRequest(
      "Field 'dataFramdId' is missing from req.query"
    );
  }

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

function validatePagination(req, res, next) {
  const { pageNo, pageSize } = req.query;
  const PARSE_INT_PAGENO = parseInt(pageNo);
  const PARSE_INT_PAGESIZE = parseInt(pageSize);

  if (Number.isNaN(PARSE_INT_PAGENO)) {
    throw new httpError.BadRequest(
      `Field 'pageNo' ${pageNo} should be a number`
    );
  }

  if (Number.isNaN(PARSE_INT_PAGESIZE)) {
    throw new httpError.BadRequest(
      `Field 'pageSize' ${pageSize} should be a number`
    );
  }

  Reflect.set(req.query, "pageNo", PARSE_INT_PAGENO);
  Reflect.set(req.query, "pageSize", PARSE_INT_PAGESIZE);
  next();
}

const missingParamsValidator = paramsValidator.createParamValidator(["dataframeId", "pageNo", "pageSize"], paramsValidator.PARAM_KEY.QUERY);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validatePagination,
  controller,
]);
