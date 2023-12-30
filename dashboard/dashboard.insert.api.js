const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const {
  insertDataFrameInDashboard,
  findDashboardById,
  dashboardDataframeLengthChecker,
} = require("./dashboard.service");
const { findDataframe } = require("../dataframe/dataframe.service");

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
  const dashboardID = req.body.dashboardID;
  const dataframeIDs = req.body.dataFrameID;

  
  await validateDashboardID(dashboardID);
  
  await validateDataFrameIDs(dataframeIDs);
  
  await validateDashboardDataframeLength(dashboardID, dataframeIDs);
  
  await duplicateDataframeReq(dashboardID, dataframeIDs);
  next();
}

async function validateDashboardID(dashboardID) {
  if (!dashboardID) {
    throw new httpError.BadRequest(
      `Field 'dashboardID' - '${dashboardID}' is missing from req.body`
    );
  }

  const EXISTING_DASHBOARD_ID = await findDashboardById(dashboardID);

  if (!EXISTING_DASHBOARD_ID) {
    throw new httpError.BadRequest(
      `Field 'dashboardID -' '${dashboardID}' is invalid.`
    );
  }
}


// There is a problem in the function 'validateDataFrameIDs'. When this function throws an error the program automatically closes. Need help to sort this out.

async function validateDataFrameIDs(dataframeIDs) {
  if (!dataframeIDs) {
    throw new httpError.BadRequest(
      `Field 'dataFrameID' is missing from req.body`
    );
  }

  if (!(dataframeIDs.length > 0)) {
    throw new httpError.BadRequest(
      `Field 'dataFrameID - ' '${dataframeIDs} should be an array'`
    );
  }

  dataframeIDs.forEach(async (id) => {
    const EXISTING_DATAFRAME_ID = await findDataframe(id);

    if (!EXISTING_DATAFRAME_ID) {
      throw new httpError.BadRequest(`dataFrame id - '${id} is invalid'`);
    }
  });
}

async function validateDashboardDataframeLength(dashboardID, dataframeIDs) {
  const EXISTING_DATAFRAMES_IN_DASHBOARD =
    await dashboardDataframeLengthChecker(dashboardID);

  const TOTAL_DATAFRAMES_IN_DASHBOARD = 10;

  const reqDataframeIdLength = dataframeIDs.length;

  if (EXISTING_DATAFRAMES_IN_DASHBOARD) {
    if (
      EXISTING_DATAFRAMES_IN_DASHBOARD.length + reqDataframeIdLength >
      TOTAL_DATAFRAMES_IN_DASHBOARD
    ) {
      throw new httpError.BadRequest(
        `dataframes in the 'dashboard id' - '${dashboardID}' is full.`
      );
    }
  }
}

async function duplicateDataframeReq(dashboardID, dataframeIDs) {
  const existingDashboard = await findDashboardById(dashboardID);

  const existingDataframes = existingDashboard.dataframeId;

  existingDataframes.forEach((dashDf) => {
    dataframeIDs.forEach((reqDf) => {
      if (dashDf === reqDf) {
        throw new httpError.BadRequest(
          `Field 'dataFrameID' - ${dashDf} is already inserted.`
        );
      }
    });
  });
}

module.exports = buildApiHandler([validateParams, controller]);

