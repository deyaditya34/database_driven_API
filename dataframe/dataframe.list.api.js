const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { searchDatasetByID } = require("../dataset/dataset.service");
const { listDataframe } = require("./dataframe.service");

async function controller(req, res) {
  const datasetID = await validateDatasetId(req);
  const datasetIDStringify = datasetID.toString()

  const queries = await listDataframe(datasetIDStringify);

  if (queries.length === 0) {
    res.json({
      message: `no saved queries for the datasetId ${datasetIDStringify}`
    })
  } else {
    res.json({
      message: "queries found",
      data: queries
    })
  }
}

async function validateDatasetId(req) {
  const datasetId = req.query.datasetId;

  const existingDataset = await searchDatasetByID(datasetId);

  if (!existingDataset) {
    throw new httpError.BadRequest(`datbaseId ${datasetId} is invalid.`);
  }

  return existingDataset._id;
}

module.exports = buildApiHandler([controller]);
