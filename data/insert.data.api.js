const buildApiHandler = require("../api-utils/build-api-handler");
const { createData } = require("./data.service");
const { parseCsvRecords } = require("../middlewares/csv_parser");

async function controller(req, res) {
  let uploadedFile = req.file;
  let itemCollector = [];
  console.log(uploadedFile)
  await parseCsvRecords(uploadedFile.path, async (obj) => {
    let insertData;
    if (obj === null) {
      if (itemCollector.length) {
        insertData = await createData(itemCollector, req.body.collectionName);
      }
      console.log("Finished Processing Records!!!");
    } else {
      itemCollector.push(obj);

      if (itemCollector.length === 10000) {
        insertData = await createData(itemCollector, req.body.collectionName);
        console.log(insertData.insertedId)
        itemCollector = [];
      }
    }
  });
  
  res.json({
    success: true,
  });
}

module.exports = buildApiHandler([controller]);
