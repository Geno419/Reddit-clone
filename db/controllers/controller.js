const {
  fetchAllTopics,
  fetchApiEndpoints,
  fetchArticleByID,
  fetchAllArticles,
  fetchCommentsByArticleId,
  fetchPostedComment,
  verifyArticle,
  verifyUsername,
  verifyComment,
  updateVoteByArticleId,
  removeComment,
} = require("../model/model.js");

exports.getTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send(topics);
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
      res.status(200).send(result);
    })
    .catch((err) => next(err));
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => next(err));
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  verifyArticle(article_id, res, next)
    .then(() => fetchCommentsByArticleId(article_id, next))
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => next(err));
};

exports.postCommentById = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  verifyArticle(article_id, res, next)
    .then(() => {
      return verifyUsername(username, res, next);
    })
    .then(() => {
      return fetchPostedComment(article_id, username, body);
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
      return updateVoteByArticleId(IncrementBy, article_id, res, next);
    })
    .then(({ votes }) => {
      res.status(200).send({ votes });
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
      res.status(200).send(data);
    })
    .catch((err) => next(err));
};
