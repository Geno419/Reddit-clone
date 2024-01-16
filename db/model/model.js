const fs = require("fs/promises");
const path = require("path");
const db = require("../connection");

exports.fetchAllTopics = () => {
  return db
    .query(
      `
    SELECT * FROM   topics;`
    )
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      throw err;
    });
};

exports.fetchApiEndpoints = () => {
  const filePath = path.join(__dirname, "..", "..", "endpoints.json");

  return fs
    .readFile(filePath, "utf-8")
    .then((data) => {
      return JSON.parse(data);
    })
    .catch((error) => {
      throw error;
    });
};

exports.fetchArticleByID = (article_id) => {
  return db
    .query(
      `
  SELECT * FROM articles WHERE article_id = $1;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    })

    .catch((err) => {
      throw err;
    });
};

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title,articles.topic, articles.article_id,articles.topic,
        articles.created_at, articles.votes, articles.article_img_url,
        comments.article_id AS comment_count
        FROM articles 
        INNER JOIN  
        comments ON comments.article_id = articles.article_id
        ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      throw err;
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
  SELECT * FROM comments WHERE article_id = $1 
  ORDER BY comments.created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      throw err;
    });
};
