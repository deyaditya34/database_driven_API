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
    
    const invalidHobbies = Hobbies.filter(
      (hobby) => !Number.isNaN(parseInt(hobby))
    );

    if (invalidHobbies.length) {
      throw new httpError.BadRequest(
        `Hobbies '${invalidHobbies.join(",")}' are invalid. Should be Text`
      );
    }

    return {
      Name,
      Age: Number(Age),
      Hobbies,
    };
  });

  return dataRecords;
}

module.exports = objectHandler;
