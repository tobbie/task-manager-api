const express = require('express');
const Task = require('../models/task');
const router = express.Router()

router.get('/tasks', async (request, response)=>{

    try {
        const tasks = await  Task.find({});
        response.status(200).send(tasks);
    }
    catch(e){
        response.status(500).send(e.message);
    }

})

router.get('/tasks/:id', async (request, response)=>{
    const _id = request.params.id;
    try {
        const task = await Task.findById(_id);
        if(!task){
            return response.sendStatus(404);
        }
        response.status(200).send(task);
    }
    catch(e){
        response.status(500).send(e.message);
    }
   
})

router.patch('/tasks/:id', async (request, response)=>{

    const updates = Object.keys(request.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if(!isValidOperation){
      return  response.status(400).send({error: 'Invalid update'})
    }
    
    const _id = request.params.id;
    try {
        const task = await Task.findByIdAndUpdate(_id, request.body,{ new:true, runValidators:true})
        if(!task){
            return response.statusCode(404);
        }

        response.status(200).send(task)

    } catch (error) {
        response.status(400).send(error)
    }
})

router.post('/tasks', async (request, response)=>{
    const task = new Task(request.body);
    try {
       const result = await task.save();
       response.status(201).send(result._id);
    } catch (error) {
        response.status(400).send(error.message)
    }
   
    
})

router.delete('/tasks/:id', async (request, response)=>{
    try {
        const task = await Task.findByIdAndDelete(request.params.id)
        if(!task){
            return response.sendStatus(404);
        }
        response.send(task);

    } catch (e) {
        response.status(500).send(e);
    }
})

module.exports = router;