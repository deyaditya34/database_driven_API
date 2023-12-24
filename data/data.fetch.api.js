const buildApiHandler = require("../api-utils/build-api-handler");
const { getData } = require("./data.service");



async function controller(req, res) {
  let { filter, collectionName } = req.body;


  if (!collectionName) {
    collectionName = "n_a_h_p";
  }

  if (!filter) {
    filter = {
      "name": "Walter",
      "age": {
        "$gt": 75
      }
    }
  }

  res.setHeader("Content-disposition","attachment; filename=outputFile.csv")
  res.setHeader("Content-type", "text/csv")
  await getData(filter, collectionName, res)
  
  res.end();
 
}

module.exports = buildApiHandler([controller]);
