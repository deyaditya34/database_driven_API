const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user.Resolver");
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

module.exports = buildApiHandler([userResolver,controller]);
