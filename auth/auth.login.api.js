const buildApiHandler = require("../api-utils/build-api-handler");
const {
  createParamValidator,
  PARAM_KEY,
} = require("../middlewares/params.validator.api");
const userResolver = require("../middlewares/user.Resolver");
const authService = require("./auth.service");
const { validateUsernameAndPassword } = require("./auth.utils");

async function controller(req, res) {
  const {username, password} = req.body;

  const token = await authService.login(username, password)

  res.json({
    success: true,
    data: {
      username: username,
      token: token
    }
  })
}

const missingParamsValidator = createParamValidator(
  ["username", "password"],
  PARAM_KEY.BODY
);

module.exports = buildApiHandler([userResolver, missingParamsValidator, validateUsernameAndPassword, controller]);
