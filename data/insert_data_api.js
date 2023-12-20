const buildApiHandler = require("../api-utils/build-api-handler");
const { createData } = require("./data.service");
const { parseCsvRecords } = require("../middlewares/csv_parser");

async function controller(req, res) {
  let uploadedFiles = req.file;
  let itemCollector = [];

  await parseCsvRecords(uploadedFiles.path, async (obj) => {
    let insertData;
    if (obj === null) {
      if (itemCollector.length) {
        insertData = await createData(itemCollector, req.body.collectionName);
        console.log(data);
      }

      console.log("Finished Processing Records!!!");
    } else {
      itemCollector.push(obj);
    
      if (itemCollector.length === 10) {
        insertData = await createData(itemCollector, req.body.collectionName);
        console.log(insertData.insertedCount);
        itemCollector = [];
      }
    }
  });

  res.json({
    success: true,
  });
}

module.exports = buildApiHandler([controller]);
