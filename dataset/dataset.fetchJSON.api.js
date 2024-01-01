const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { findDataframe } = require("../dataframe/dataframe.service");
const { searchDatasetByID, getDataPaginated } = require("./dataset.service");
const userResolver = require("../middlewares/user.Resolver");

async function controller(req, res) {
  const dataFrame = await validateDataframeId(req);

  const filter = dataFrame.filters;

  const datasetName = await findDatasetName(req);

  const { pageNo, pageSize } = validatePagination(req);

  let result = await getDataPaginated(filter, datasetName, pageNo, pageSize);

  if (result.length === 0) {
    res.json({
      message: "No data found for the dataframeId",
    });
  } else {
    res.json({
      message: "data found",
      data: result,
    });
  }
}

async function validateDataframeId(req) {
  const dataFrameId = req.query.dataFrameId;

  if (!dataFrameId) {
    throw new httpError.BadRequest(
      "Field 'dataFramdId' is missing from req.query"
    );
  }

  const existingDataframe = await findDataframe(dataFrameId);

  if (!existingDataframe) {
    throw new httpError.BadRequest(`Field ${dataFrameId} is invalid.`);
  }

  return existingDataframe;
}

async function findDatasetName(req) {
  const dataFrame = await validateDataframeId(req);

  const dataset = await searchDatasetByID(dataFrame.datasetID);

  return dataset.datasetName;
}

function validatePagination(req) {
  const { pageNo, pageSize } = req.query;

  if (!pageNo) {
    throw new httpError.BadRequest(`Field 'pageNo' is missing from req.query`);
  }

  if (!pageSize) {
    throw new httpError.BadRequest(
      `Field 'pageSize' is missing from req.query`
    );
  }
  const PARSE_INT_PAGENO = parseInt(pageNo);
  const PARSE_INT_PAGESIZE = parseInt(pageSize);

  if (pageNo) {
    if (Number.isNaN(PARSE_INT_PAGENO)) {
      throw new httpError.BadRequest(
        `Field 'pageNo' ${pageNo} should be a number`
      );
    }
  }

  if (pageSize) {
    if (Number.isNaN(PARSE_INT_PAGESIZE)) {
      throw new httpError.BadRequest(
        `Field 'pageSize' ${pageSize} should be a number`
      );
    }
  }

  return {
    pageNo: PARSE_INT_PAGENO,
    pageSize: PARSE_INT_PAGESIZE,
  };
}

module.exports = buildApiHandler([userResolver,controller]);
