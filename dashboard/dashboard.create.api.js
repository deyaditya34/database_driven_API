const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const {createDashboard, findDashboardByName} = require("./dashboard.service")

async function controller(req, res) {

  const {dashboardName} = req.body

  let result = await createDashboard(dashboardName);

  res.json({
    message: "dashboard created",
    id: result.insertedId
  })
}




async function validateParams(req, res, next) {
  const { dashboardName } = req.body;

  if (!dashboardName) {
    throw new httpError.BadRequest(`Field 'dashboardName' is missing from req.body`)
  }

  const existingDashboard = await findDashboardByName(dashboardName)

  if (existingDashboard) {
    throw new httpError.BadRequest(`Field dashboardName - '${dashboardName}' already exists`)
  }

 next()
}

module.exports = buildApiHandler([validateParams, controller]);
