const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { findDashboardById } = require("./dashboard.service");

async function controller(req, res) {
  const { id } = req.query;

  const result = await findDashboardById(id);

  if (result) {
    res.json({
      message: "dashboard found",
      data: result,
    });
  } else {
    res.json({
      message: "not dashboard found for the id"
    })
  }
}

module.exports = buildApiHandler([controller]);
