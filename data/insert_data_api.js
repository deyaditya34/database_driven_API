const buildApiHandler = require("../api-utils/build-api-handler");
const dataformatChecker = require("../middlewares/dataFormatChecker");
const objectHandler = require("../middlewares/objectHandler");
const httpError = require("http-errors");
const {createData} = require("./data.service")

async function controller(req, res) {
  let objectParser = objectHandler(req, res)
  
  let result = await createData(objectParser);


  res.json({
    success: true,
    data: result,
  });
}

module.exports = buildApiHandler([dataformatChecker, controller]);
