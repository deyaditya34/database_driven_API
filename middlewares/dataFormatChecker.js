const httpError = require("http-errors")


function dataformatChecker(req, res, next) {
  let data = req.body;

  if (typeof data !== "string") {
    throw new httpError.BadRequest("input data must be of 'string' type")
  }

  next();
}

module.exports = dataformatChecker;