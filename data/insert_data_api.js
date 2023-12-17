const fs = require("fs");
const buildApiHandler = require("../api-utils/build-api-handler");
const { createData } = require("./data.service");
const { parseCsvRecords } = require("../middlewares/csv_parser");

async function controller(req, res) {
  let uploadedFiles = req.files;
  uploadedFiles.map(async (file) => {
    let parsedData = parseCsvRecords(file.path);
    
    if (req.body.collectionName) {
      insertData = await createData(parsedData, req.body.collectionName);
    } else {
      insertData = await createData(parsedData);
    }
  });

  res.json({
    success: true,
  });
}

module.exports = buildApiHandler([controller]);
