require('../src/db/mongoose')
const User = require('../src/models/user')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5ee10214d169d231a6daeb09').then((result)=> {
//     console.log(result);
//     return Task.countDocuments({completed : false})
// }).then((incompeteTaskCount) =>{
//     console.log(incompeteTaskCount)
// }).catch((error) =>{
//     console.log(error);
// })

const deleteTaskAndCount =  async (id) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed :false})
    return {task, count}
}

deleteTaskAndCount('5ee0cfa7c59757216a7fdfbe').then((result) =>{
    console.log(result);
}).catch((error) => {
    console.log(error);
})