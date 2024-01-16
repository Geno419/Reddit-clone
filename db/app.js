const express = require("express");
const app = express();
const {
  getTopics,
  getApiEndpoints,
  getArticleByID,
  getAllArticles,
} = require("./controllers/controller");

app.get("/api/topics", getTopics);
app.get("/api", getApiEndpoints);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles", getAllArticles);

app.use((req, res, next) => {
  res.status(404).send({ error: "Not Found" });
});
module.exports = app;
