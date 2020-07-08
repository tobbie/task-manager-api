const request = require("supertest");
const app = require("../src/app");
const { closeDatabase } = require("./fixtures/db");

describe("app.js test", () => {
  afterAll(closeDatabase);

  test("should get home page of api", async () => {
    const response = await request(app).get("/").expect(200);
    expect(response.body).not.toBeNull();
  });
});
