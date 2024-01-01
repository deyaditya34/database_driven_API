const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const {
  insertDataFrameInDashboard,
  findDashboardById,
  dashboardDataframeLengthChecker,
} = require("./dashboard.service");
const { findDataframeById } = require("../dataframe/dataframe.service");
const userResolver = require("../middlewares/user.Resolver");
const paramValidator = require("../middlewares/params.validator");

async function controller(req, res) {
  const dataframeIDs = req.body.dataFrameID;
  const dashboardID = req.body.dashboardID;

  const result = await insertDataFrameInDashboard(dashboardID, dataframeIDs);

  res.json({
    message: "dataFrame inserted",
    status: result,
  });
}

async function validateParams(req, res, next) {
 const {dashboardId, dataframeId, user} = req.body;

  await validateDashboardId(dashboardId, user.username);

  await validateDataFrameIDs(dataframeId, user.username);

  await validateDashboardDataframeLength(dashboardId, dataframeId, user.username);

  await duplicateDataframeReq(dashboardId, dataframeId, user.username);
  next();
}

async function validateDashboardId(dashboardId, username) {

  const EXISTING_DASHBOARD_ID = await findDashboardById(dashboardId, username);

  if (!EXISTING_DASHBOARD_ID) {
    throw new httpError.BadRequest(
      `Field 'dashboardID -' '${dashboardId}' is invalid.`
    );
  }
}

// There is a problem in the function 'validateDataFrameIDs'. When this function throws an error the program automatically closes. Need help to sort this out.

async function validateDataFrameIDs(dataframeId, username) {

  if (!(dataframeId.length > 0)) {
    throw new httpError.BadRequest(
      `Field 'dataFrameID - ' '${dataframeId} should be an array'`
    );
  }

  dataframeId.forEach(async (id) => {
    const EXISTING_DATAFRAME_ID = await findDataframeById(id, username);

    if (!EXISTING_DATAFRAME_ID) {
      throw new httpError.BadRequest(`dataFrame id - '${id} is invalid'`);
    }
  });
}

async function validateDashboardDataframeLength(dashboardId, dataframeId, username) {
  const EXISTING_DATAFRAMES_IN_DASHBOARD =
    await dashboardDataframeLengthChecker(dashboardId, username);

  const TOTAL_DATAFRAMES_IN_DASHBOARD = 10;

  const reqDataframeIdLength = dataframeId.length;

  if (EXISTING_DATAFRAMES_IN_DASHBOARD) {
    if (
      EXISTING_DATAFRAMES_IN_DASHBOARD.length + reqDataframeIdLength >
      TOTAL_DATAFRAMES_IN_DASHBOARD
    ) {
      throw new httpError.BadRequest(
        `dataframes in the 'dashboard id' - '${dashboardId}' is full.`
      );
    }
  }
}

async function duplicateDataframeReq(dashboardId, dataframeId, username) {
  const existingDashboard = await findDashboardById(dashboardId, username);

  const existingDataframes = existingDashboard.dataframeId;

  existingDataframes.forEach((dashDf) => {
    dataframeId.forEach((reqDf) => {
      if (dashDf === reqDf) {
        throw new httpError.BadRequest(
          `Field 'dataFrameId' - ${dashDf} is already inserted.`
        );
      }
    });
  });
}

const missingParamsValidator = paramValidator.createParamValidator(
  ["dashboardId", "dataFrameId"],
  paramValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateParams,
  controller,
]);
