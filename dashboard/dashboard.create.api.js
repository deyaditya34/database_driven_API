const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { createDashboard, findDashboardByName } = require("./dashboard.service");
const userResolver = require("../middlewares/user.Resolver");
const paramValidator = require("../middlewares/params.validator");

async function controller(req, res) {
  const { dashboardName, user } = req.body;

  let result = await createDashboard(dashboardName, user.username);

  res.json({
    message: "dashboard created",
    id: result.insertedId,
  });
}

async function validateParams(req, res, next) {
  const { dashboardName, user } = req.body;

  if (!dashboardName) {
    throw new httpError.BadRequest(
      `Field 'dashboardName' is missing from req.body`
    );
  }

  const existingDashboard = await findDashboardByName(dashboardName, user.username);

  if (existingDashboard) {
    throw new httpError.BadRequest(
      `Field dashboardName - '${dashboardName}' already exists`
    );
  }

  next();
}

const missingParamValidator = paramValidator.createParamValidator(
  ["dashboardName"],
  paramValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamValidator,
  validateParams,
  controller,
]);
