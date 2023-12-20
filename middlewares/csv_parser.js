const fs = require("fs");
const readline = require("readline");

async function parseCsvRecords(filepath, cb) {
  const lineFeed = readline.createInterface(fs.createReadStream(filepath));

  let header = null;

  for await (const line of lineFeed) {
    if (isLineNotEmpty(line)) {
      const row = line.split(",").map(parseValue);

      if (!header) {
        header = row;
      } else {
        const record = buildObjectFromRow(row, header);
        await cb(record);
      }
    }
  }

  await cb(null);
}

function isLineNotEmpty(line) {
  return line.length !== 0;
}

function parseValue(value) {
  if (!value) {
    return null;
  }

  const number = Number(value);
  if (!Number.isNaN(number)) {
    return number;
  }

  if (value.includes(";")) {
    return value.split(";");
  }

  return value;
}

function buildObjectFromRow(row, header) {
  return header.reduce((acc, field, i) => {
    Reflect.set(acc, field.toString(), row[i]);

    return acc;
  }, {});
}

let recordStore = [];

module.exports = {
  parseCsvRecords,
  recordStore,
};
