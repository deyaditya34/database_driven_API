const buildApiHandler = require("../api-utils/build-api-handler");
const checkAdminRights = require("../middlewares/check.admin.rights");
const userResolver = require("../middlewares/user.Resolver");
const { listUser } = require("./auth.service");

async function controller(req, res) {
  const users = await listUser();

  if (users.length === 0) {
    res.json({
      message: "no user found"
    })
  } else {
    res.json({
      message: "users found",
      data: users
    })
  }
}

module.exports = buildApiHandler([userResolver, checkAdminRights, controller]);
