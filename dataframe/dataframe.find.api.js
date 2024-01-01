const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { findDataframeById } = require("./dataframe.service");
const userResolver = require("../middlewares/user.Resolver");

async function controller(req, res) {
  const {user} = req.body;
  const dataFramdeId = req.query.dataFrameId;

  if (!dataFramdeId) {
    throw new httpError.BadRequest(`"dataFrameId" is missing from req.query.`);
  }

  let query = await findDataframeById(dataFramdeId, user.username);

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

module.exports = buildApiHandler([userResolver,controller]);
