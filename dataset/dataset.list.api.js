const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user.Resolver");
const { listDataset } = require("./dataset.service");

async function controller(req, res) {
  const {user} = req.body;
  let result = await listDataset(user.username);

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
