const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { findDataframe } = require("./dataframe.service");

async function controller(req, res) {
  const dataFramdeId = req.query.dataFrameId;

  if (!dataFramdeId) {
    throw new httpError.BadRequest(`"dataFrameId" is missing from req.query.`);
  }

  let query = await findDataframe(dataFramdeId);

  if (!query) {
    res.json({
      message: "no query found for the dataframeId",
    });
  } else {
    res.json({
      message: "query found",
      data: query,
    });
  }
}

module.exports = buildApiHandler([controller]);
