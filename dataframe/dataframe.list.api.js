const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user.Resolver");
const { listDataframe } = require("./dataframe.service");

async function controller(req, res) {
  const { user } = req.body;

  const dataframeList = await listDataframe(user.username);

  if (dataframeList.length === 0) {
    res.json({
      message: `no dataframe saved for the user - ${user.username}`,
    });
  } else {
    res.json({
      message: "dataframe found",
      data: dataframeList,
    });
  }
}

module.exports = buildApiHandler([userResolver, controller]);
