const request = require("supertest");
const Task = require("../src/models/task");
const app = require("../src/app");
const {
  testUser,
  testUserId,
  setupDatabase,
  testUser2,
  testUser2Id,
  task1,
  closeDatabase,
} = require("./fixtures/db");

describe("task tests", () => {
  beforeEach(setupDatabase);
  afterAll(closeDatabase);

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

  test("should fail to delete task created by another user", async () => {
    const response = await request(app)
      .delete(`/tasks/${task1._id}`)
      .set("Authorization", `Bearer ${testUser2.tokens[0].token}`)
      .send()
      .expect(404);

    const task = Task.findById(task1.id);
    expect(task).not.toBeNull();
  });

  test("should get a single task for test user 1", async () => {
    const response = await request(app)
      .get(`/tasks/${task1._id}`)
      .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
      .send()
      .expect(200);

    expect(response.body).not.toBeNull();
  });
});
