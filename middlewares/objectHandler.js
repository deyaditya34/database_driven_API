const httpError = require("http-errors");

function objectHandler(req, res) {
  const [headerRow, ...dataRows] = req.body
    .split("\n")
    .map((line) => line.split(","));

  const dataRecords = dataRows.map((dataRow) => {
    const [Name, Age, ...Hobbies] = dataRow;

    if (Number.isNaN(parseInt(Age))) {
      throw new httpError.BadRequest(`Age ${Age} should be of number type`);
    }

    if (!Number.isNaN(parseInt(Name))) {
      throw new httpError.BadRequest(`Name ${Name} should be of string type`);
    }

    Hobbies.forEach(element => {
      if (!Number.isNaN(parseInt(element))) {
        throw new httpError.BadRequest(`Hobbies ${element} should be of string type`);
      }
    });

    return {
      Name,
      Age: Number(Age),
      Hobbies,
    };
  });

  return dataRecords;
}

module.exports = objectHandler;
