const express = require("express");
const cors = require("cors");
const app = express();
const {
  getTopics,
  getApiEndpoints,
  getArticleByID,
  getCommentsByArticleId,
  postCommentById,
  patchByArticleId,
  deleteCommentByID,
  getAllUsers,
  getArticle,
} = require("./controllers/controller.js");
app.use(express.json());
app.use(cors());
app.get("/api/topics", getTopics);
app.get("/api", getApiEndpoints);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles", getArticle);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getAllUsers);

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
