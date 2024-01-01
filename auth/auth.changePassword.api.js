const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user.Resolver");
const authUtils = require("./auth.utils");
const authService = require("./auth.service");
const {
  createParamValidator,
  PARAM_KEY,
} = require("../middlewares/params.validator");

async function controller(req, res) {
  const { username, password, newPassword } = req.body;

  const token = await authService.changePassword(
    username,
    password,
    newPassword
  );

  res.json({
    message: "success",
    token,
  });
}

const missingParamsValidator = createParamValidator(
  ["username", "password", "newPassword"],
  PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  authUtils.validateUsernameAndPassword,
  controller,
]);
