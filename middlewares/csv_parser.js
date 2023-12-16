const fs = require("fs");
const event = require("events");

function parseCsvRecords(filepath) {
  const fileData = fs.readFileSync(filepath, { encoding: "utf-8" })

  const [header, ...rows] = fileData.toString()
    .split("\n")
    .filter(isLineNotEmpty)
    .map((line) => line.split(",").map(parseValue))
    
  return  rows.map((row) => buildObjectFromRow(row, header));

}

function isLineNotEmpty(line) {
  return line.length !== 0
}

function parseValue(value) {
  if (!value) {
    return null
  }

  const number = Number(value)
  if (!Number.isNaN(number)) {
    return number
  }

  if (value.includes(";")) {
    return value.split(";")
  }

  return value
}

function buildObjectFromRow(row, header) {
  return header.reduce((acc, field, i) => {
    Reflect.set(acc, field.toString(), row[i])

    return acc
  }, {})
}

module.exports = {parseCsvRecords};

let parsedData