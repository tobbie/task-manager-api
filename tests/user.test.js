const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { testUser, testUserId, setupDatabase } = require("./fixtures/db");

describe("user tests", () => {
  beforeEach(setupDatabase);

  test("Should signup a new user", async () => {
    await request(app)
      .post("/users")
      .send({
        name: "Jim Jones",
        email: "jim@example.com",
        password: "Jim_Jones_2020",
      })
      .expect(201);
  });

  test("Should login an existing user", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    const user = await User.findById(response.body.user._id);
    expect(response.body.token).toBe(user.tokens[1].token);
  });

  test("Should prevent invalid user from login", async () => {
    await request(app)
      .post("/users/login")
      .send({
        email: "mike@gmail.com",
        password: "mike_2020",
      })
      .expect(400);
  });

  test("Should get profile for user", async () => {
    await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
      .send()
      .expect(200);
  });

  test("Should not get profile for unauthenticated user", async () => {
    await request(app).get("/users/me").send().expect(401);
  });

  test("Should delete account for user", async () => {
    const response = await request(app)
      .delete("/users/me")
      .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
      .send()
      .expect(200);

    //Assert that user was removed from database
    const user = await User.findById(response.body._id);
    expect(user).toBeNull();
  });

  test("Should not delete account for unauthenticated user", async () => {
    await request(app).delete("/users/me").send().expect(401);
  });

  test("Should update user field", async () => {
    const response = await request(app)
      .patch("/users/me")
      .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
      .send({
        name: "David Akinseye",
      })
      .expect(200);

    expect(response.body.name).toBe("David Akinseye");
  });

  test("Should fail to update user field", async () => {
    const response = await request(app)
      .patch("/users/me")
      .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
      .send({
        gender: "Male",
      })
      .expect(400);
  });

  test("should upload profile pic", async () => {
    await request(app)
      .post("/users/me/avatar")
      .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
      .attach("avatar", "tests/fixtures/profile-pic.jpg")
      .expect(200);

    const user = await User.findById(testUserId);
    expect(user.avatar).toEqual(expect.any(Buffer));
  });
});
