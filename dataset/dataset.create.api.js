const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { createDataset, searchDatasetByName} = require("./dataset.service");
const userResolver = require("../middlewares/user.Resolver");


async function controller(req, res) {
  const { datasetName, user } = req.body;
 
  let result = await createDataset({ datasetName, username: user.username });

  res.json({
    message: "dataset created",
    data: {
      id: result.insertedId,
    },
  });
}

async function validateParams(req, res, next) {
  const { datasetName } = req.body;
  
  if (!datasetName) {
    throw new httpError.BadRequest('the key should be named as "datasetName" in order to create dataset in the DB.')
  }

  let existingDatasetName = await searchDatasetByName({datasetName})

  if (existingDatasetName) {
    throw new httpError.BadRequest(`datasetName ${datasetName} already exists.`)
  }

  if (typeof datasetName !== "string") {
    throw new httpError.BadRequest(
      `datasetName ${datasetName} should be of string type.`
    );
  }

  next();
}

module.exports = buildApiHandler([userResolver,validateParams, controller]);
