const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user.Resolver");
const checkAdminRights = require("../middlewares/check.admin.rights");
const authUtils = require("./auth.utils");
const authService = require("./auth.service");
const {
  createParamValidator,
  PARAM_KEY,
} = require("../middlewares/params.validator");

async function controller(req, res) {
  const { username, password } = req.body;

  await authService.register(username, password);

  res.json({
    success: true,
    data: username,
  });
}

const missingParamsParamsValidator = createParamValidator(
  ["username", "password"],
  PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  checkAdminRights,
  missingParamsParamsValidator,
  authUtils.validateUsernameAndPassword,
  controller,
]);
