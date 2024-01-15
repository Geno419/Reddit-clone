const express = require("express");
const app = express();
const { getTopics, getApiEndpoints } = require("./controllers/controller");

app.get("/api/topics", getTopics);
app.get("/api", getApiEndpoints);

app.use((req, res, next) => {
  res.status(404).send({ error: "Not Found" });
});
module.exports = app;
