const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { removeDataframeFromDashboard, findDashboardById } = require("./dashboard.service");
const { findDataframe } = require("../dataframe/dataframe.service");
const userResolver = require("../middlewares/user.Resolver");

async function controller(req, res) {
const {dashboardId, dataframeId} = req.body;

let result = await removeDataframeFromDashboard(dashboardId, dataframeId);

res.json({
  data: result
})
}

async function validateDataframeId(req, res, next) {
  const dashboardId = req.body.dashboardId;
  const dataframeId = req.body.dataframeId;

  if (!dashboardId) {
    throw new httpError.BadRequest(`Field 'dashboardId' is missing from req.body.`)
  }

  const EXISTING_DASHBOARD_ID = await findDashboardById(dashboardId);

  if (!EXISTING_DASHBOARD_ID) {
    throw new httpError.BadRequest(`Field 'dashboardId -' '${dashboardId}' is invalid.`)
  }

  if (!dataframeId) {
    throw new httpError.BadRequest(`Field 'dataframeId' is missing from req.body.`)
  }

  const EXISTING_DATAFRAME_ID = await findDataframe(dataframeId);

  if (!EXISTING_DATAFRAME_ID) {
    throw new httpError.BadRequest(`Field 'dataframeId -' '${dataframeId}' is invalid.`)
  }

  next();
}

module.exports = buildApiHandler([userResolver,validateDataframeId, controller])