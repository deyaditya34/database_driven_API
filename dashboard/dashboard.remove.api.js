const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const {
  removeDataframeFromDashboard,
  findDashboardById,
} = require("./dashboard.service");
const { findDataframeById } = require("../dataframe/dataframe.service");
const userResolver = require("../middlewares/user.Resolver");
const paramValidator = require("../middlewares/params.validator");

async function controller(req, res) {
  const { dashboardId, dataframeId } = req.query;
  const {user} = req.body;

  let result = await removeDataframeFromDashboard(dashboardId, dataframeId, user.username);

  res.json({
    data: result,
  });
}

async function validateDataframeId(req, res, next) {
  const {dashboardId, dataframeId} = req.query;
  const {user} = req.body;

  const EXISTING_DASHBOARD_ID = await findDashboardById(dashboardId, user.username);

  if (!EXISTING_DASHBOARD_ID) {
    throw new httpError.BadRequest(
      `Field 'dashboardId -' '${dashboardId}' is invalid.`
    );
  }

  const EXISTING_DATAFRAME_ID = await findDataframeById(dataframeId, user.username);

  if (!EXISTING_DATAFRAME_ID) {
    throw new httpError.BadRequest(
      `Field 'dataframeId -' '${dataframeId}' is invalid.`
    );
  }

  next();
}

const missingParamsValidator = paramValidator.createParamValidator(
  ["dashboardId", "dataFrameId"],
  paramValidator.PARAM_KEY.QUERY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateDataframeId,
  controller,
]);
