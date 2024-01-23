const {
  fetchAllTopics,
  fetchApiEndpoints,
  fetchArticleByID,
  postCommentsByArticleId,
  insertPostedComment,
  verifyArticle,
  verifyUsername,
  verifyComment,
  updateVoteByArticleId,
  removeComment,
  fetchAllUsers,
  fetchArticle,
  verifyTopic,
} = require("../model/model.js");

exports.getTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch((err) => next(err));
};
exports.getApiEndpoints = (req, res, next) => {
  fetchApiEndpoints()
    .then((apiEndpoints) => {
      res.status(200).json(apiEndpoints);
    })
    .catch((err) => next(err));
};
exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleByID(article_id)
    .then((result) => {
      res.status(200).send({ result: result });
    })
    .catch((err) => next(err));
};
exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  verifyArticle(article_id, res, next)
    .then(() => postCommentsByArticleId(article_id, next))
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => next(err));
};
exports.postCommentById = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  verifyArticle(article_id, res)
    .then(() => {
      return verifyUsername(username, res, next);
    })
    .then(() => {
      return insertPostedComment(article_id, username, body);
    })
    .then((comment) => {
      res.status(200).send({ comment: comment });
    })
    .catch((err) => next(err));
};
exports.patchByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { IncrementBy } = req.body;
  verifyArticle(article_id, res, next)
    .then(() => {
      return updateVoteByArticleId(IncrementBy, article_id);
    })
    .then(({ votes }) => {
      res.status(200).send({ votes: votes });
    })
    .catch((err) => next(err));
};
exports.deleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  verifyComment(comment_id, res, next)
    .then(() => {
      return removeComment(comment_id, next);
    })
    .then((data) => {
      res.status(200).send({ data: data });
    })
    .catch((err) => next(err));
};
exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => res.status(200).send({ users: users }))
    .catch((err) => next(err));
};
exports.getArticle = (req, res, next) => {
  const { topic } = req.query;
  verifyTopic(topic)
    .then(() => fetchArticle(topic, res))
    .then((articles) => res.status(200).send({ articles }))
    .catch((err) => next(err));
};
