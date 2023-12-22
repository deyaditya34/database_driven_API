const buildApiHandler = require("../api-utils/build-api-handler");
const { searchData } = require("./data.service");

async function controller(req, res) {
  const reqBodyKeys = Object.keys(req.body);

  let newReq = {};
  let collectionName;

  reqBodyKeys.forEach((key) => {
    if (key !== "collectionName") {
      return (newReq[key] = req.body[key]);
    }
  });

  if (req.body.collectionName) {
    collectionName = req.body.collectionName;
  } else {
    collectionName = "n_a_h_p";
  }

  let result = await searchData(newReq, collectionName);

  if (!result) {
    res.json({
      message: "No data found",
    });
  } else {
    res.json({
      message: "data found",
      success: result,
    });
  }
}

module.exports = buildApiHandler([controller]);
