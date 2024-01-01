const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { findDashboardById } = require("./dashboard.service");
const userResolver = require("../middlewares/user.Resolver");
const paramValidator = require("../middlewares/params.validator");

async function controller(req, res) {
  const { user } = req.body;
  const {dashboardId} = req.query;

  const result = await findDashboardById(dashboardId, user.username);

  if (result) {
    res.json({
      message: "dashboard found",
      data: result,
    });
  } else {
    res.json({
      message: "not dashboard found for the id",
    });
  }
}

const missingParamsValidator = paramValidator.createParamValidator(
  ["dashboardId"],
  paramValidator.PARAM_KEY.QUERY
);

module.exports = buildApiHandler([userResolver,missingParamsValidator, controller]);
