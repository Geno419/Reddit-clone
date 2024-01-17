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
        expect(res.body.length).toBe(data.topicData.length);
        res.body.forEach((topic) => {
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
    const apiEndpoints = JSON.parse(data);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(apiEndpoints);
  });
});

describe("GET /api/article:article_id", () => {
  test("/api/article:article_id returns article by id", () => {
    return request(app)
      .get("/api/articles/1")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        res.body.forEach((topic) => {
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
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body).toBeSortedBy("created_at", { descending: true });
        res.body.forEach((article) => {
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

describe("POST /api/articles/:article_id/comments ", () => {
  test(".../:article_id/comments adds new comment to given article_id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "To be, or not to be, that is the question",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((comment) => {
        expect(comment).toHaveProperty(
          "text",
          `${newComment.username} commented ${newComment.body}`
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
      .expect(404)
      .then((err) => {
        expect(err).toHaveProperty("text", `${article_id} is not an article`);
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
describe("GET /api/articles/:article_id/comments ", () => {
  test(".../:article_id/comments returns all comments for given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then((res) => {
        expect(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body).toBeSortedBy("created_at", {
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
        res.body.forEach((comment) => {
          expect(comment).toMatchObject(expectedCommentStructure);
        });
      });
  });
  test("returns 404 when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/888/comments")
      .then((err) => {
        expect(err.status).toBe(404);
        expect(err).toHaveProperty("text", "id not found");
      });
  });
});
