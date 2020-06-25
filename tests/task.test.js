const request = require("supertest");
const Task = require("../src/models/task");
const app = require("../src/app");
const { testUser, testUserId, setupDatabase } = require("./fixtures/db");

describe("task tests", () => {
  beforeEach(setupDatabase);

  test("should create task for user", async () => {
    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
      .send({
        description: "From my test",
      })
      .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
  });

  test("should get all tasks for test user one", async () => {
    const response = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
      .send()
      .expect(200);

    expect(response.body.length).toBe(2);
  });
});
