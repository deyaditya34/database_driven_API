const buildApiHandler = require("../api-utils/build-api-handler");
const { listDataset } = require("./dataset.service");

async function controller(req, res) {
  let result = await listDataset(req.query.datasetId);

  if (result) {
    res.json({
      message: "dataset found",
      data: result,
    });
  } else {
    res.json({
      messsage: "no dataset found",
    });
  }
}

module.exports = buildApiHandler([controller]);
