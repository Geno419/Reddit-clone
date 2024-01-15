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
      console.error("Error in fetchAllTopics", err);
      throw err;
    });
};
