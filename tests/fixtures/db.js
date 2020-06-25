const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const testUserId = new mongoose.Types.ObjectId();

const testUser = {
  _id: testUserId,
  name: "Tobi Akinseye",
  email: "tobi.akinseye@gmail.com",
  password: "tobi_2020",
  tokens: [
    {
      token: jwt.sign({ _id: testUserId }, process.env.JWT_SECRET),
    },
  ],
};

const testUser2Id = new mongoose.Types.ObjectId();
const testUser2 = {
  _id: testUser2Id,
  name: "Tope Akinseye",
  email: "awopetu3@gmail.com",
  password: "tope_2020",
  tokens: [
    {
      token: jwt.sign({ _id: testUser2Id }, process.env.JWT_SECRET),
    },
  ],
};

const task1 = {
  _id: new mongoose.Types.ObjectId(),
  description: "First task",
  completed: false,
  owner: testUser._id,
};

const task2 = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second task",
  completed: false,
  owner: testUser._id,
};

const task3 = {
  _id: new mongoose.Types.ObjectId(),
  description: "Third task",
  completed: false,
  owner: testUser2._id,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(testUser).save();
  await new User(testUser2).save();
  await new Task(task1).save();
  await new Task(task2).save();
  await new Task(task3).save();
};

module.exports = {
  testUser,
  testUserId,
  testUser2,
  testUserId,
  setupDatabase,
};
