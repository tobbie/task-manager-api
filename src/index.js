const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port  = process.env.PORT


app.use(express.json()) //automatically parse incoming requests as json
app.use(userRouter);
app.use(taskRouter);

app.get('/', (req, res) => {
    res.send("<h2>Welcome to task manager api</h2>");
})


app.listen(port,() =>{
    console.log(`task manager api is running on port ${port}`)
})
