const buildApiHandler = require("../api-utils/build-api-handler");
const authService = require("./auth.service");
const userResolver = require("../middlewares/user.Resolver");
const checkAdminRights = require("../middlewares/check.admin.rights");
const { validateUsernameAndPassword } = require("./auth.utils");
const paramsValidator = require("../middlewares/params.validator");

async function controller(req, res) {
  const { query } = req.body;

  const result = await authService.findUsers({
    ...query,
    role: { $ne: "ADMIN" },
  });

  if (result.length === 0) {
    res.json({
      message: "No users found",
    });
  } else {
    res.json({
      message: "Users found",
      data: result,
    });
  }
}

const missingParamsValidator = paramsValidator.createParamValidator(
  ["query"],
  paramsValidator.PARAM_KEY.BODY
);

function processQuery(req) {
  const { username } = req.body.query;

  let parsedQuery = {};

  parsedQuery.username = { $regex: username };

  Reflect.set(req.body, "query", parsedQuery);
}

module.exports = buildApiHandler([
  userResolver,
  checkAdminRights,
  missingParamsValidator,
  validateUsernameAndPassword,
  controller,
]);
