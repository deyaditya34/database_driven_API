const db = require("../services/database.service");
const csvService = require("../services/csv.service");

const DATA_FETCH_BATCH_SIZE = 10000;

async function getData(filter, collectionName, outStream) {
  let headersWritten = false;
  let result = [];
  let skip = 0;
  do {
    result = await db
      .getCollection(collectionName)
      .find(filter)
      .skip(skip)
      .limit(DATA_FETCH_BATCH_SIZE)
      .toArray();

    if (!headersWritten) {
      let header = Object.keys(result[0]);
      csvService.writeCsvHeader(header, outStream);

      headersWritten = true;
    }

    csvService.writeCsvItems(result, outStream);

    skip += DATA_FETCH_BATCH_SIZE;
  } while (result.length > 0);
}

module.exports = getData;
