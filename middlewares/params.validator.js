const httpError = require("http-errors");

const createParamValidator =
  (params = [], paramsKey) =>
  (req, res, next) => {
    const reqParams = Reflect.get(req, paramsKey);

    const missingParams = params.filter((param) => {
      return !Reflect.has(reqParams, param);
    });

    if (missingParams.length > 0) {
      throw new httpError.BadRequest(
        `Required fields are '${missingParams.join(
          ","
        )} are missing from '${paramsKey}'`
      );
    }
    next();
  };

const PARAM_KEY = {
  QUERY: "query",
  PARAMS: "params",
  BODY: "body",
};

module.exports = { createParamValidator, PARAM_KEY};
