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
    });
};
exports.fetchApiEndpoints = () => {
  const filePath = path.join(__dirname, "..", "..", "endpoints.json");

  return fs.readFile(filePath, "utf-8").then((data) => {
    return JSON.parse(data);
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
    });
};
exports.postCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
  SELECT * FROM comments WHERE article_id = $1
    ORDER BY comments.created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
exports.insertPostedComment = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments 
        (body, article_id, author)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [body, article_id, username]
    )
    .then(({ rows }) => {
      return rows;
    });
};
exports.updateVoteByArticleId = (IncrementBy, article_id, res) => {
  return db
    .query(
      `SELECT votes FROM articles
      WHERE article_id = $1;`,
      [article_id]
    )
    .then(({ rows }) => {
      const { votes } = rows[0];
      return Number(votes) + Number(IncrementBy);
    })
    .then((updatedVote) => {
      return db.query(
        `UPDATE articles
        SET votes = $1
        WHERE article_id = $2
        RETURNING *;`,
        [String(updatedVote), article_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
exports.verifyUsername = (username, res) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        res.status(404).send(`The username "${username}" does not exist`);
      }
    });
};
exports.verifyArticle = (article_id, res) => {
  let id = Number(article_id);
  if (isNaN(id)) {
    return res.status(400).send(`${article_id} is invalid`);
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        res.status(400).send(`article_id: ${article_id} not found`);
      }
    });
};
exports.verifyComment = (comment_id, res) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return res.status(400).send(`${comment_id} is not a valid comment id`);
      }
    });
};
exports.removeComment = (comment_id) => {
  return db
    .query(
      `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING true;`,
      [comment_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
exports.fetchAllUsers = () => {
  return db
    .query(
      `
  SELECT * FROM users;`
    )
    .then(({ rows }) => rows);
};

exports.verifyTopic = (topic, res) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return res.status(404).send(`topic does not exist`);
      }
    });
};

exports.fetchAllArticles = () => {
  return db
    .query(
      `
      SELECT articles.author, articles.title, articles.topic, articles.article_id, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
      FROM articles 
      LEFT JOIN comments ON comments.article_id = articles.article_id
      GROUP BY articles.author, articles.title, articles.topic, articles.article_id, articles.created_at, articles.votes, articles.article_img_url
      ORDER BY articles.created_at DESC;
    `
    )
    .then(({ rows }) => rows);
};

exports.fetchArticlesByTopic = (topic) => {
  return db
    .query(
      `
      SELECT articles.author, articles.title, articles.topic, articles.article_id, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
      FROM articles 
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE articles.topic = $1
      GROUP BY articles.author, articles.title, articles.topic, articles.article_id, articles.created_at, articles.votes, articles.article_img_url
      ORDER BY articles.created_at DESC;
    `,
      [topic]
    )
    .then(({ rows }) => {
      return rows;
    });
};
