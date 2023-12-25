const buildApiHandler = require("../api-utils/build-api-handler");
const { dashboardList } = require("./dashboard.service");

async function controller(req, res) {

  let result = await dashboardList();

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


module.exports = buildApiHandler([controller])