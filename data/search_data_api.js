const buildApiHandler = require("../api-utils/build-api-handler");
const { searchData } = require("./data.service");

async function controller(req, res) {
  const reqBodyKeys = Object.keys(req.body);

  let newReq = {};

  const parsedQueries = reqBodyKeys.map((key) => {
    if (key !== "collectionName") {
      return (newReq[key] = req.body[key]);
    }
  });
  let result;
  if (req.body.collectionName) {
     result = await searchData(newReq, req.body.collectionName);
  } else {
     result = await searchData(newReq)
  }

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
