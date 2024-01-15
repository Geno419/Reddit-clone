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
