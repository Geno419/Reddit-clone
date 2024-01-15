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

describe("test DB for requests", () => {
  test("responds with 404 for invalid path", () => {
    return request(app)
      .get("/api/nonexistentpath")
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Not Found");
      });
  });
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
  test("serves up a json representation of all the available endpoints of the api", () => {
    return request(app)
      .get("/api")
      .then(async (res) => {
        expect(res.status).toBe(200);
        const filePath = path.join(__dirname, "..", "endpoints.json");
        const data = await fs.readFile(filePath, "utf-8");
        const apiEndpoints = JSON.parse(data);
        expect(res.body).toEqualapiEndpoints;
      });
  });
});
