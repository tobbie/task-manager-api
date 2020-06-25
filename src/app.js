const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();

app.use(express.json()); //automatically parse incoming requests as json
app.use(userRouter);
app.use(taskRouter);

app.get("/", (req, res) => {
  res.send("<h2>Welcome to task manager api</h2>");
});

module.exports = app;
