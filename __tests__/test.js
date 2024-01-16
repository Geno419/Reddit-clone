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
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe("Not Found");
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
        expect(res.body).toBeSorted("comments.created_at");
        expect(res.body).toBeSorted({ descending: true });
        res.body.forEach((topic) => {
          expect(topic).toHaveProperty("title");
          expect(topic).toHaveProperty("article_id");
          expect(topic).toHaveProperty("author");
          expect(topic).not.toHaveProperty("body");
          expect(topic).toHaveProperty("topic");
          expect(topic).toHaveProperty("created_at");
          expect(topic).toHaveProperty("votes");
          expect(topic).toHaveProperty("article_img_url");
          expect(topic).toHaveProperty("comment_count");
        });
      });
  });
});
