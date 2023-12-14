const buildApiHandler = require("../api-utils/build-api-handler");
const { searchData } = require("./data.service");

async function controller(req, res) {
const {Name, Age, Hobbies} = req.query;

let searchParams = {};

if (Name) {
  searchParams['Name'] = Name;
}

if (Age) {
  searchParams['Age'] = Age;
}

if (Hobbies) {
  searchParams['Hobbies'] = Hobbies;
}

const result = await searchData(searchParams);



res.json({
  success: result
})
}


module.exports = buildApiHandler([controller])