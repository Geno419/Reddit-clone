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

describe("GET /api/topics", () => {
  test("/api/topics returns all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics.length).toBeGreaterThan(0);
        const expectedTopicStructure = {
          slug: expect.any(String),
          description: expect.any(String),
        };
        res.body.topics.forEach((topic) => {
          expect(topic).toMatchObject(expectedTopicStructure);
        });
      });
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
});

describe("GET /api", () => {
  test("api return description of all api endpoints", async () => {
    const res = await request(app).get("/api");
    const filePath = path.join(__dirname, "..", "endpoints.json");
    const data = await fs.readFile(filePath, "utf-8");
    expect(res.status).toBe(200);
    expect(res.body.apiEndpoints).toEqual(JSON.parse(data));
  });
});

describe("GET /api/article:article_id", () => {
  test("/api/article:article_id returns article by id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.result.length).toBeGreaterThan(0);
        const expectedResultStructure = {
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        };
        res.body.result.forEach((result) => {
          expect(result).toMatchObject(expectedResultStructure);
        });
      });
  });
  test("responds with 404 for invalid path", () => {
    return request(app)
      .get("/api/nonexistentpath/1")
      .then((err) => {
        expect(err.status).toBe(404);
        expect(err).toHaveProperty("error");
        expect(err.body.error).toBe("endpoint not found");
      });
  });
  test("responds with 400 for invalid article_id", () => {
    return request(app)
      .get("/api/articles/999")
      .then((err) => {
        expect(err.status).toBe(400);
        expect(err).toHaveProperty("error");
        expect(err.text).toBe("article_id: 999 not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("/api/articles returns all article in order of date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles.length).toBeGreaterThan(0);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        const expectedArticleStructure = {
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        };
        res.body.articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toMatchObject(expectedArticleStructure);
        });
      });
  });
  test("responds with 404 for invalid path", () => {
    return request(app)
      .get("/api/nonexistentpath")
      .then((err) => {
        expect(err.status).toBe(404);
        expect(err).toHaveProperty("error");
        expect(err.body.error).toBe("endpoint not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments ", () => {
  test(".../:article_id/comments returns all comments for given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
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
  test("responds with 404 for invalid path", () => {
    return request(app)
      .get("/api/nonexistentpath/1/comments")
      .then((err) => {
        expect(err.status).toBe(404);
        expect(err).toHaveProperty("error");
        expect(err.body.error).toBe("endpoint not found");
      });
  });
  test("responds with 400 for invalid article_id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .then((err) => {
        expect(err.status).toBe(400);
        expect(err).toHaveProperty("error");
        expect(err.text).toBe("article_id: 999 not found");
      });
  });
  test(".../:article_id/comments returns empty array for article that exist but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((res) => {
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
      .expect(200)
      .then((res) => {
        const comment = res.body.comment;
        expect(res.body).toHaveProperty("comment");
        expect(comment[0].body).toContain(
          "To be, or not to be, that is the question"
        );
      });
  });
  test("returns not an article when article not in DB", () => {
    const article_id = 999;
    const newComment = {
      username: "icellusedkars",
      body: "To be, or not to be, that is the question",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then((err) => {
        expect(err).toHaveProperty("error");
        expect(err.text).toBe("article_id: 999 not found");
      });
  });
  test("returns 400 when body missing username and or body DB", () => {
    const article_id = 1;
    const newComment = {
      username: "",
      body: "",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then((err) => {
        expect(err).toHaveProperty("error");
        expect(err.text).toBe("username or comment are empty");
      });
  });
  test("returns not registered user when username not in DB", () => {
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
      .expect(200)
      .then((res) => {
        expect(res.body.votes).toEqual(110);
      });
  });
  test("update vote count by -100", () => {
    const IncrementByObj = { IncrementBy: "-100" };
    return request(app)
      .patch("/api/articles/1")
      .send(IncrementByObj)
      .expect(200)
      .then((res) => {
        expect(res.body.votes).toEqual(0);
      });
  });
  test("return 400 for invalid article_id", () => {
    const IncrementByObj = { IncrementBy: "1000" };
    return request(app)
      .patch("/api/articles/9999")
      .send(IncrementByObj)
      .expect(400)
      .then((err) => {
        expect(err.text).toEqual("article_id: 9999 not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("delete the given comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(200)
      .then((res) => {
        expect(res.body.data[0]).toEqual({ bool: true });
      });
  });
  test("return error 400 when comment_id not in DB", () => {
    return request(app)
      .delete("/api/comments/8998")
      .expect(400)
      .then((res) => {
        expect(res.text).toEqual("8998 is not a valid comment id");
      });
  });
});

describe("GET /api/users", () => {
  test("return all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
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
      .expect(200)
      .then((res) => {
        expect(res.body.articles.length).toBeGreaterThan(0);
        const expectedArticleStructure = {
          author: expect.any(String),
          title: expect.any(String),
          topic: "cats",
          article_id: expect.any(Number),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        };
        res.body.articles.forEach((article) => {
          expect(article).toMatchObject(expectedArticleStructure);
        });
      });
  });
  test("return empty array for existing id but no article", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toEqual([]);
      });
  });
  test("returns 400 status when the topic is not found", () => {
    return request(app)
      .get("/api/articles?topic=nonexistenttopic")
      .expect(400)
      .then((res) => {
        expect(res.text).toEqual(`topic does not exist`);
      });
  });
});
