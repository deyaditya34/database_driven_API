const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user.Resolver");
const { searchDatasetByName } = require("./dataset.service");

async function controller(req, res) {
  const { user } = req.body;
  const {datasetName} = req.query;

  let result = await searchDatasetByName(datasetName, user.username);

  if (result) {
    res.json({
      message: "dataset name found",
      data: {
        id: result,
      },
    });
  } else {
    res.json({
      message: "No dataset name found",
    });
  }
}

module.exports = buildApiHandler([userResolver, controller]);
