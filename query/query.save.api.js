const buildApiHandler = require("../api-utils/build-api-handler");
const { querySave } = require("./query.service");

async function controller(req, res) {
  let parsedQueriesArr = queryProcess(req);
  
  let dataframe = await querySave(parsedQueriesArr)

  res.json({
    message: "queries saved",
    data: dataframe,
  });
}

function queryProcess(req) {
  const queryName = Object.keys(req.body);
  const queryValue = Object.values(req.body);
  
  let result = {};

  result[queryName[0]] = queryValue[0];
  result[queryName[1]] = queryValue[1];
  result[queryName[2]] = queryValue[2];

  return result;
}

module.exports = buildApiHandler([controller]);
