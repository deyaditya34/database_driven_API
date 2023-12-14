const readline = require("readline");
const fs = require("fs");
const httpError = require("http-errors");

function objectHandler(req, res) {
  let data = req.body;

  let parsedData = data.split("\n");
  let rows = [];

  for (let i = 0; i < parsedData.length; i++) {
    let tempData = parsedData[i].split(",");
    rows.push(tempData);
  }

  let result = [];
  let headers = rows.shift();
  let hobbies = [];
  let rowHobbies = [];

  // Here the hobbies are parsed and stuffed in a nested Array.
  for (let i = 0; i < rows.length; i++) {
    for (let j = 2; j < rows[i].length; j++) {
      rowHobbies.push(rows[i][j]);
    }
    hobbies.push(rowHobbies);
    rowHobbies = [];
  }

  // Here the rows are parsed and coverted to the desired object.
  let count = 0;
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    let rowData = {};
    for (let j = 0; j < headers.length; j++) {
      if (headers[j] === "Hobbies") {
        rowData[headers[j]] = hobbies[count];
        count++;
      } else {
        rowData[headers[j]] = row[j];
      }
    }
    result.push(rowData);
  }

  return result;
}

module.exports = objectHandler;
