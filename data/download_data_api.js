const buildApiHandler = require("../api-utils/build-api-handler");
const fs = require("fs");
const { downloadData } = require("./data.service");
const { csvBuilder } = require("../middlewares/csv_builder");

const outStream = fs.createWriteStream("outputFiles/outputFile.csv");

async function controller(req, res) {
  const reqBodyKeys = Object.keys(req.body);

  let newReq = {};
  let collectionName;

  reqBodyKeys.forEach((key) => {
    if (key !== "collectionName") {
      return (newReq[key] = req.body[key]);
    }
  });

  if (req.body.collectionName) {
    collectionName = req.body.collectionName;
  } else {
    collectionName = "n_a_h_p";
  }


  while (true) {
    result = await downloadData(newReq, collectionName, writeCsv, async(items) => {
      outStream.close(() => {
        console.log("File write stream closed!!!");
      });

      res.json({
        success: true,
        message: "Files written",
      });
    });
  }
}

let headers = null;

let totalFilesWritten = 0;

async function writeCsv(items) {
  if (!headers) {
    headers = Object.keys(items[0]).join(",");
    outStream.write(`${JSON.stringify(headers)}\n`);
  }
  items.forEach(async (item) => {
    outStream.write(`${JSON.stringify(await csvBuilder(item))}\n`);
  });

  totalFilesWritten += items.length;
  console.log(`${totalFilesWritten} files written in the output file`);
}

module.exports = buildApiHandler([controller]);
