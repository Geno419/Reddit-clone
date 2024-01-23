const request = require("supertest");
const app = require("../db/app.js");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const fs = require("fs/promises");
const path = require("path");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

test("responds with 404 for invalid path", () => {
  return request(app)
    .get("/api/nonexistentpath")
    .then((res) => {
      expect(res.status).toBe(404);
      expect(res).toHaveProperty("error");
      expect(res.body.error).toBe("endpoint not found");
    });
});

describe("GET /api/topics", () => {
  test("/api/topics returns all topics", () => {
    return request(app)
      .get("/api/topics")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.topics.length).toBe(data.topicData.length);
        res.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("GET /api", () => {
  test("api return description of all api endpoints", async () => {
    const res = await request(app).get("/api");
    const filePath = path.join(__dirname, "..", "endpoints.json");
    const data = await fs.readFile(filePath, "utf-8");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(JSON.parse(data));
  });
});

describe("GET /api/article:article_id", () => {
  test("/api/article:article_id returns article by id", () => {
    return request(app)
      .get("/api/articles/1")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.result.length).toBeGreaterThan(0);
        res.body.result.forEach((topic) => {
          expect(topic).toHaveProperty("author");
          expect(topic).toHaveProperty("title");
          expect(topic).toHaveProperty("article_id");
          expect(topic).toHaveProperty("body");
          expect(topic).toHaveProperty("topic");
          expect(topic).toHaveProperty("created_at");
          expect(topic).toHaveProperty("votes");
          expect(topic).toHaveProperty("article_img_url");
        });
      });
  });
});

describe("GET /api/articles ", () => {
  test("/api/articles returns all article in order of date", () => {
    return request(app)
      .get("/api/articles")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.articles.length).toBeGreaterThan(0);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        res.body.articles.forEach((article) => {
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("author");
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments ", () => {
  test(".../:article_id/comments returns all comments for given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.comments.length).toEqual(11);
        expect(res.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
        const expectedCommentStructure = {
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
        };
        res.body.comments.forEach((comment) => {
          expect(comment).toMatchObject(expectedCommentStructure);
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test("returns 404 when article_id does not exist", () => {
    return request(app)
      .get(`/api/articles/888/comments`)
      .then((err) => {
        expect(err.status).toBe(400);
      });
  });
  test("returns 400 when article_id is invalid", () => {
    return request(app)
      .get(`/api/articles/katherine/comments`)
      .then((err) => {
        expect(err.status).toBe(400);
      });
  });
  test(".../:article_id/comments returns empty array for article that exist but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments ", () => {
  test(".../:article_id/comments adds new comment to given article_id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "To be, or not to be, that is the question",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .then((res) => {
        const comment = res.body.comment;
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("comment");
        expect(comment[0].body).toContain(
          "To be, or not to be, that is the question"
        );
      });
  });
  test("returns not an article when article not in DB", () => {
    const article_id = 9999;
    const newComment = {
      username: "icellusedkars",
      body: "To be, or not to be, that is the question",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then((err) => {
        expect(err).toHaveProperty("text", `${article_id} is not found`);
      });
  });
  test("returns 'not registered user when username not in DB", () => {
    const article_id = 1;
    const newComment = {
      username: "Hamlet",
      body: "To be, or not to be, that is the question",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(404)
      .then((err) => {
        expect(err).toHaveProperty(
          "text",
          `The username "${newComment.username}" does not exist`
        );
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("update vote count by ten", () => {
    const IncrementByObj = { IncrementBy: "10" };
    return request(app)
      .patch("/api/articles/1")
      .send(IncrementByObj)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(Number(Object.values(res.body))).toEqual(110);
      });
  });
  test("update vote count by -100", () => {
    const IncrementByObj = { IncrementBy: "-100" };
    return request(app)
      .patch("/api/articles/1")
      .send(IncrementByObj)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(Number(Object.values(res.body))).toEqual(0);
      });
  });
  test("return 400 for invalid article_id", () => {
    const IncrementByObj = { IncrementBy: "1000" };
    return request(app)
      .patch("/api/articles/9999")
      .send(IncrementByObj)
      .then((err) => {
        expect(err.status).toBe(400);
        expect(err.text).toEqual("9999 is not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("delete the given comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.data[0]).toEqual({ bool: true });
      });
  });
  test("return error 404 when comment_id not in DB", () => {
    return request(app)
      .delete("/api/comments/8998")
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.text).toEqual("8998 is not a comment");
      });
  });
});

describe("GET /api/users", () => {
  test("return all users", () => {
    return request(app)
      .get("/api/users")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.users.length).toBeGreaterThan(0);
        const expectedUserStructure = {
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        };
        res.body.users.forEach((user) => {
          expect(user).toMatchObject(expectedUserStructure);
        });
      });
  });
});

describe("GET /api/articles?(topic query)", () => {
  test("return all articles relating to queried topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .then((res) => {
        expect(res.status).toBe(200);
        const expectedArticleStructure = {
          author: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          article_id: expect.any(Number),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        };
        res.body.articles.forEach((article) => {
          expect(article).toMatchObject(expectedArticleStructure);
          expect(article.topic).toEqual("cats");
        });
      });
  });
  test("return empty array for existing id but no article", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.articles).toEqual([]);
      });
  });
  test("returns 404 status when the topic is not found", () => {
    return request(app)
      .get("/api/articles?topic=nonexistenttopic")
      .then((response) => {
        expect(response.status).toBe(404);
      });
  });
});
