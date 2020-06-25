const app = require("./app");

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`task manager api is running on port ${port}`);
});
