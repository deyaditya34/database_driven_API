const express = require("express");
const config = require("./config");
const database = require("./services/database.service");

const requestLogger = require("./middlewares/requestLogger");
const notFoundHandler = require("./api-utils/not-found-handler");
const errorHandler = require("./api-utils/error-handler");

const dataRouter = require("./data/data.router");
const queryRouter = require("./query/query.router");
const datasetRouter = require("./dataset/dataset.router.api");
const dashboardRouter = require("./dashboard/dashboard.router.api");

async function start() {
  console.log("[INIT]: Connecting to database");
  await database.initialise();

  console.log("[Init]: Starting Server");

  const server = new express();
  server.use(express.json());
  server.use(express.text());

  server.use(requestLogger);

  server.use("/dataset", datasetRouter);
  server.use("/data", dataRouter);
  server.use("/query", queryRouter);
  server.use("/dashboard", dashboardRouter);

  server.use(notFoundHandler);
  server.use(errorHandler);
  server.listen(config.APP_PORT, () => {
    console.log("[init]: database_driven_API_App running on", config.APP_PORT);
  });
}

start().catch((error) => {
  console.log("[fatal]: could not start expense-tracker application");
  console.log(error);
});
