const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const { parseCsvRecords } = require("../middlewares/csv.parser");
const userResolver = require("../middlewares/user.Resolver");
const { searchDatasetByID, insertData } = require("./dataset.service");
const paramsValidator = require("../middlewares/params.validator")

async function controller(req, res) {
  const {datasetId} = req.query;
  const {user} = req.body;
  const DATASET_NAME = await findDataset(datasetId);

  let uploadedFile = req.file;
  let itemCollector = [];
  let totalItemsWritten = 0;
  const ITEMS_TO_WRITE = 10000;

  console.log(uploadedFile);

  await parseCsvRecords(uploadedFile.path, async (obj) => {
    let insertDataToDataset;
    if (obj === null) {
      if (itemCollector.length) {
        insertDataToDataset = await insertData(itemCollector, DATASET_NAME, user.username);
      }
      console.log("Finished Processing Records!!!");
    } else {
      itemCollector.push(obj);

      if (itemCollector.length === ITEMS_TO_WRITE) {
        insertDataToDataset = await insertData(itemCollector, DATASET_NAME, user.username);
        totalItemsWritten += ITEMS_TO_WRITE;
        itemCollector = [];
      }
    }
  });

  res.json({
    success: true,
    message: "Finished Processing Records",
    data: `${totalItemsWritten} items written to '${DATASET_NAME}'`,
  });
}

async function findDataset(datasetId) {
  let existingDatasetId = await searchDatasetByID(datasetId);

  if (!existingDatasetId) {
    throw new httpError.BadRequest(`Field datasetId - '${datasetId}' is not valid.`)
  }

  return existingDatasetId.datasetName;
}

const missingParamsValidator = paramsValidator.createParamValidator(["datasetId"], paramsValidator.PARAM_KEY.QUERY)

module.exports = buildApiHandler([userResolver,missingParamsValidator,controller]);
