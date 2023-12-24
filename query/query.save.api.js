const buildApiHandler = require("../api-utils/build-api-handler");
const { querySave } = require("./query.service");

async function controller(req, res) {
  let parsedQueriesArr = queryProcess(req);

  let result = await querySave(parsedQueriesArr)

  res.json({
    message: "queries saved",
    data: result.insertedCount,
  });
}

function queryProcess(req) {
  const queryName = Object.keys(req.body);
  const queryValue = Object.values(req.body);

  let result = [];

  queryName.forEach((name, i) => {
    let item = {};
    
    Reflect.set(item, "queryName", name);
    Reflect.set(item, "queryValue", queryValue[i]);

    result.push(item);
  });

  return result;
}

module.exports = buildApiHandler([controller]);
