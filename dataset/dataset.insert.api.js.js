const buildApiHandler = require("../api-utils/build-api-handler");
const { createData } = require("../data/data.service");
const { parseCsvRecords } = require("../middlewares/csv_parser");
const { searchDatasetByID } = require("./dataset.service");

async function controller(req, res) {
  
  const DATASET_NAME = await findDataset(req);
  
  let uploadedFile = req.file;
  let itemCollector = [];
  let totalItemsWritten = 0;
  const ITEMS_TO_WRITE = 10000; 

  console.log(uploadedFile)
  
  await parseCsvRecords(uploadedFile.path, async (obj) => {
    let insertData;
    if (obj === null) {
      if (itemCollector.length) {
        insertData = await createData(itemCollector, DATASET_NAME);
      }
      console.log("Finished Processing Records!!!");
    } else {
      itemCollector.push(obj);

      if (itemCollector.length === ITEMS_TO_WRITE) {
        insertData = await createData(itemCollector, DATASET_NAME);
        totalItemsWritten += ITEMS_TO_WRITE;
        itemCollector = [];
      }
    }
  });
  
  res.json({
    success: true,
    message: "Finished Processing Records",
    data : `${totalItemsWritten} items written to '${DATASET_NAME}'`

  });
}

async function findDataset(req) {
  const datasetId = req.query.id;
  
  let existingDatasetId = await searchDatasetByID(datasetId);
  
  return existingDatasetId.datasetName;

}


module.exports = buildApiHandler([controller]);
