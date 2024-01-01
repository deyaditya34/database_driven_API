const httpError = require("http-errors");

function checkAdminRights(req, res, next) {
  const { user } = req.body;

  if (!user) {
    throw new httpError.Forbidden("No User found to check rights");
  }

  if (user.role !== "admin") {
    throw new httpError.Unauthorized("User not authorized.");
  }

  next();
}

module.exports = checkAdminRights;
