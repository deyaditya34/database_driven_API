const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user.Resolver");
const { dashboardList } = require("./dashboard.service");

async function controller(req, res) {
  const {user} = req.body;

  let result = await dashboardList(user.username);

  if (result.length !== 0) {
    res.json({
      message: "dashboard found",
      data: result
    })
  } else {
    res.json({
      message: "no dashboard found"
    })
  }
}


module.exports = buildApiHandler([userResolver,controller])