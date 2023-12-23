const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { searchData } = require("./data.service");

async function controller(req, res) {
  const { pageNo, pageSize, filter } = req.body;

  let collectionName;

  if (req.body.collectionName) {
    collectionName = req.body.collectionName;
  } else {
    collectionName = "n_a_h_p";
  }
  
  let result = await searchData(filter, pageNo, pageSize, collectionName);

  if (result.length === 0) {
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

function validatePageNoAndPageSize(req, res, next) {
  const { pageNo, pageSize } = req.body;

  if (!pageNo) {
    Reflect.set(req.body, "pageNo", 1)
  }

  if (!pageSize) {
    Reflect.set(req.body, "pageSize", 10)
  }

  if (pageNo) {
    if (typeof pageNo !== "number") {
      if (Number.isNaN(parseInt(pageNo))) {
        throw new httpError.BadRequest(
          `pageNo ${pageNo} should be of number type.`
        );
      }
      Reflect.set(req.body, "pageNo", parseInt(pageNo));
    }
  }

  if (pageSize) {
    if (typeof pageSize !== "number") {
      if (Number.isNaN(parseInt(pageSize))) {
        throw new httpError.BadRequest(
          `pageSize ${pageSize} should be of number type.`
        );
      }
      Reflect.set(req.body, "pageSize", parseInt(pageSize));
    }
  }

  next();
}

module.exports = buildApiHandler([validatePageNoAndPageSize, controller]);
