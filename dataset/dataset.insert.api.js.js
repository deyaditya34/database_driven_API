const buildApiHandler = require("../api-utils/build-api-handler");
const { parseCsvRecords } = require("../middlewares/csv_parser");
const userResolver = require("../middlewares/user.Resolver");
const { searchDatasetByID, insertData } = require("./dataset.service");

async function controller(req, res) {
  const DATASET_NAME = await findDataset(req);

  let uploadedFile = req.file;
  let itemCollector = [];
  let totalItemsWritten = 0;
  const ITEMS_TO_WRITE = 10000;

  console.log(uploadedFile);

  await parseCsvRecords(uploadedFile.path, async (obj) => {
    let insertDataToDataset;
    if (obj === null) {
      if (itemCollector.length) {
        insertDataToDataset = await insertData(itemCollector, DATASET_NAME);
      }
      console.log("Finished Processing Records!!!");
    } else {
      itemCollector.push(obj);

      if (itemCollector.length === ITEMS_TO_WRITE) {
        insertDataToDataset = await insertData(itemCollector, DATASET_NAME);
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

async function findDataset(req) {
  const datasetId = req.query.id;

  let existingDatasetId = await searchDatasetByID(datasetId);

  return existingDatasetId.datasetName;
}

module.exports = buildApiHandler([userResolver,controller]);
