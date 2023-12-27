const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { queryFind } = require("../query/query.service");
const { insertDataFrameInDashboard, findDashboardById, dashboardDataframeLengthChecker } = require("./dashboard.service");

async function controller(req, res) {
const dataframeIDs = req.body.dataFrameID;
const dashboardID = req.body.dashboardID;

const result = await insertDataFrameInDashboard(dashboardID, dataframeIDs);

res.json({
  message: "dataFrame inserted",
  status: result,
})

}

async function validateParams(req, res, next) {
  const dashboardID = req.body.dashboardID;
  const dataframeIDs = req.body.dataFrameID;

  if (!dashboardID) {
    throw new httpError.BadRequest(`Field 'dashboardID' - '${dashboardID}' is missing from req.body`)
  }

  const EXISTING_DASHBOARD_ID = await findDashboardById(dashboardID);

  if (!EXISTING_DASHBOARD_ID) {
    throw new httpError.BadRequest(`Field 'dashboardID -' '${dashboardID}' is invalid.`)
  }

  // const EXISTING_DATAFRAMES_IN_DASHBOARD = await dashboardDataframeLengthChecker(dashboardID);

  // if (EXISTING_DATAFRAMES_IN_DASHBOARD.length === 10) {
  //   throw new httpError.BadRequest(`dataframes in the 'dashboard id' - '${dashboardID}' is full.`)
  // }

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
    const EXISTING_DATAFRAME_ID = await queryFind(id);

    if (!EXISTING_DATAFRAME_ID) {
      throw new httpError.BadRequest(`dataFrame id - '${id} is invalid'`);
    }
  });

  next();
}


module.exports = buildApiHandler([validateParams, controller]);
