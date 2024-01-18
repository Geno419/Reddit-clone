const express = require("express");
const app = express();
const {
  getTopics,
  getApiEndpoints,
  getArticleByID,
  getAllArticles,
  getCommentsByArticleId,
  postCommentById,
  patchByArticleId,
  deleteCommentByID,
} = require("./controllers/controller.js");
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApiEndpoints);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentById);

app.patch("/api/articles/:article_id", patchByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentByID);

app.all("*", (req, res) => {
  res.status(404).send({ error: "endpoint not found" });
});

app.use((err, req, res, next) => {
  res.status(404).send({ error: err });
});

module.exports = app;
