const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { searchDatasetByID, getData } = require("./dataset.service");
const { findDataframe } = require("../dataframe/dataframe.service");
const userResolver = require("../middlewares/user.Resolver");



async function controller(req, res) {
 
  const dataFrame = await validateDataframeId(req);
  const filter =  dataFrame.filters;
  const datasetName = await findDatasetName(req);
  

  res.setHeader("Content-disposition","attachment; filename=outputFile.csv")
  res.setHeader("Content-type", "text/csv")
  await getData(filter, datasetName, res)
  
  res.end();
 
}

async function validateDataframeId(req) {
  const dataFrameId = req.query.dataFrameId;

  if (!dataFrameId) {
    throw new httpError.BadRequest("Field 'dataFramdId' is missing from req.query")
  }

  const existingDataframe = await findDataframe(dataFrameId);

  if (!existingDataframe) {
    throw new httpError.BadRequest(`Field ${dataFrameId} is invalid.`)
  }

  return existingDataframe;
}

async function findDatasetName(req) {

  const dataFrame = await validateDataframeId(req);

  const dataset = await searchDatasetByID(dataFrame.datasetID)

  return dataset.datasetName;
}




module.exports = buildApiHandler([userResolver,controller]);
