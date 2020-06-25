const request = require("supertest");

const app = require("../src/app");

test("should get home page of api", async () => {
  const response = await request(app).get("/").expect(200);

  expect(response.body).not.toBeNull();
});
