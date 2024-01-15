const request = require("supertest");
const app = require("../db/app.js");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("test DB for requests", () => {
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
