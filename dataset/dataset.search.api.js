const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { searchDatasetByName } = require("./dataset.service");

async function controller(req, res) {
  const { datasetName } = req.body;

  let result = await searchDataset({ datasetName });

  if (result) {
    res.json({
      message: "dataset name found",
      data: {
        id: result._id,
      },
    });
  } else {
    res.json({
      message: "No dataset name found",
    });
  }
}

module.exports = buildApiHandler([controller]);
