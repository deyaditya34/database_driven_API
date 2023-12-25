const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const {createDashboard} = require("./dashboard.service")

async function controller(req, res) {

  const dashboardName = validateParams(req);

  let result = await createDashboard(dashboardName);

  res.json({
    message: "dashboard created",
    id: result.insertedId
  })
}




function validateParams(req) {
  const { dashboardName } = req.body;

  if (!dashboardName) {
    throw new httpError.BadRequest(`Field 'dashboardName' is missing from req.body`)
  }

  return dashboardName;
}

module.exports = buildApiHandler([controller]);
